import EventEmitter from "events";
import crypto from "crypto";
// @ts-ignore
import LRU from "lru";
import debug0 from "debug";
// @ts-ignore
import Protomux from "protomux";
import { Packet } from "./messages.js";
// @ts-ignore
import c from "compact-encoding";
import b4a from "b4a";
// @ts-ignore
import sodium from "sodium-universal";

const debug = debug0("dht-flood");

const LRU_SIZE = 255;
const TTL = 255;
const PROTOCOL = "lumeweb.flood";

export default class DHTFlood extends EventEmitter {
  private id: Buffer;
  private ttl: number;
  private messageNumber: number;
  private lru: LRU;
  private swarm: any;
  private protocol: string;
  private topic: Buffer;
  private symbol: Symbol;
  private socketMap: Set<Function> = new Set<Function>();

  constructor({
    lruSize = LRU_SIZE,
    ttl = TTL,
    messageNumber = 0,
    id = crypto.randomBytes(32),
    swarm = null,
    protocol = PROTOCOL,
  } = {}) {
    super();

    this.id = id;
    this.ttl = ttl;
    this.messageNumber = messageNumber;
    this.lru = new LRU(lruSize);
    this.protocol = protocol;
    if (!swarm) {
      throw new Error("swarm is required");
    }
    this.swarm = swarm;

    this.swarm.on("connection", (peer: any) => {
      const mux = Protomux.from(peer);
      mux.pair({ protocol: this.protocol }, () => this.setupPeer(peer));
    });

    const topic = b4a.from(this.protocol);
    const topicHash = b4a.allocUnsafe(32);
    sodium.crypto_generichash(topicHash, topic);

    this.topic = topicHash as Buffer;

    this.swarm.join(topicHash);

    this.symbol = Symbol.for(this.protocol);
  }

  private handleMessage(
    { originId, messageNumber, ttl, data }: Packet,
    messenger: any
  ) {
    const originIdBuf = b4a.from(originId) as Buffer;

    // Ignore messages from ourselves
    if (originIdBuf.equals(this.id))
      return debug("Got message from self", originId, messageNumber);

    // Ignore messages we've already seen
    const key = originIdBuf.toString("hex") + messageNumber;
    if (this.lru.get(key))
      return debug(
        "Got message that was already seen",
        originId,
        messageNumber
      );
    this.lru.set(key, true);

    this.emit("message", data, originId, messageNumber);

    if (ttl <= 0) {
      return debug("Got message at end of TTL", originId, messageNumber, ttl);
    }

    messenger.send({
      originId,
      messageNumber,
      data,
      ttl: ttl - 1,
    });
  }

  private setupPeer(peer: any) {
    const mux = Protomux.from(peer);
    let chan: any;

    const self = this;
    if (!mux.opened({ protocol: this.protocol })) {
      chan = mux.createChannel({
        protocol: this.protocol,
        async onopen() {
          self.emit("peer-open", peer);
        },
      });
      if (chan) {
        // @ts-ignore
        peer[this.symbol] = chan;
      }
    }

    if (!this.socketMap.has(peer)) {
      const close = () => {
        self.emit("peer-remove", peer);
        peer.removeListener("close", close);
        this.socketMap.delete(peer);
      };

      peer.on("close", close);
      this.socketMap.add(peer);
    }

    // @ts-ignore
    chan = peer[this.symbol];

    if (!chan) {
      throw new Error("could not find channel");
    }

    if (!chan.messages.length) {
      chan.addMessage({
        encoding: {
          preencode: (state: any, m: any) =>
            c.raw.preencode(state, Packet.toBinary(Packet.create(m))),
          encode: (state: any, m: any) =>
            c.raw.encode(state, Packet.toBinary(Packet.create(m))),
          decode: (state: any) => Packet.fromBinary(c.raw.decode(state)),
        },
        onmessage: (msg: any) => this.handleMessage(msg, chan.messages[0]),
      });
    }

    if (!chan.opened) {
      chan.open();
    }

    return chan.messages[0];
  }

  broadcast(data: any, ttl = this.ttl) {
    this.messageNumber++;
    const { id, messageNumber } = this;

    let topicString = this.topic.toString("hex");

    let peers: Buffer[] = [...this.swarm.peers.values()]
      .filter((peerInfo: any) => peerInfo._seenTopics.has(topicString))
      .map((peerInfo) => peerInfo.publicKey);

    for (const peer of peers) {
      const conn = this.swarm._allConnections.get(peer);
      if (conn) {
        continue;
      }

      const message = this.setupPeer(conn);
      message.send({
        originId: id,
        messageNumber,
        ttl,
        data: b4a.from(data),
      });
    }
  }

  send(peer: any, data: any, ttl = this.ttl) {
    this.messageNumber++;
    const { id, messageNumber } = this;

    const message = this.setupPeer(peer);
    message.send({
      originId: id,
      messageNumber,
      ttl,
      data: b4a.from(data),
    });
  }
}
