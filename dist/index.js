"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const crypto_1 = __importDefault(require("crypto"));
// @ts-ignore
const lru_1 = __importDefault(require("lru"));
const debug_1 = __importDefault(require("debug"));
// @ts-ignore
const protomux_1 = __importDefault(require("protomux"));
const messages_js_1 = require("./messages.js");
// @ts-ignore
const compact_encoding_1 = __importDefault(require("compact-encoding"));
const b4a_1 = __importDefault(require("b4a"));
// @ts-ignore
const sodium_universal_1 = __importDefault(require("sodium-universal"));
const debug = (0, debug_1.default)("dht-flood");
const LRU_SIZE = 255;
const TTL = 255;
const PROTOCOL = "lumeweb.flood";
class DHTFlood extends events_1.default {
    id;
    ttl;
    messageNumber;
    lru;
    swarm;
    protocol;
    topic;
    symbol;
    socketMap = new Set();
    constructor({ lruSize = LRU_SIZE, ttl = TTL, messageNumber = 0, id = crypto_1.default.randomBytes(32), swarm = null, protocol = PROTOCOL, } = {}) {
        super();
        this.id = id;
        this.ttl = ttl;
        this.messageNumber = messageNumber;
        this.lru = new lru_1.default(lruSize);
        this.protocol = protocol;
        if (!swarm) {
            throw new Error("swarm is required");
        }
        this.swarm = swarm;
        this.swarm.on("connection", (peer) => {
            const mux = protomux_1.default.from(peer);
            mux.pair({ protocol: this.protocol }, () => this.setupPeer(peer));
        });
        const topic = b4a_1.default.from(this.protocol);
        const topicHash = b4a_1.default.allocUnsafe(32);
        sodium_universal_1.default.crypto_generichash(topicHash, topic);
        this.topic = topicHash;
        this.swarm.join(topicHash);
        this.symbol = Symbol.for(this.protocol);
    }
    handleMessage({ originId, messageNumber, ttl, data }, messenger) {
        const originIdBuf = b4a_1.default.from(originId);
        // Ignore messages from ourselves
        if (originIdBuf.equals(this.id))
            return debug("Got message from self", originId, messageNumber);
        // Ignore messages we've already seen
        const key = originIdBuf.toString("hex") + messageNumber;
        if (this.lru.get(key))
            return debug("Got message that was already seen", originId, messageNumber);
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
    setupPeer(peer) {
        const mux = protomux_1.default.from(peer);
        let chan;
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
                    preencode: (state, m) => compact_encoding_1.default.raw.preencode(state, messages_js_1.Packet.toBinary(messages_js_1.Packet.create(m))),
                    encode: (state, m) => compact_encoding_1.default.raw.encode(state, messages_js_1.Packet.toBinary(messages_js_1.Packet.create(m))),
                    decode: (state) => messages_js_1.Packet.fromBinary(compact_encoding_1.default.raw.decode(state)),
                },
                onmessage: (msg) => this.handleMessage(msg, chan.messages[0]),
            });
        }
        if (!chan.opened) {
            chan.open();
        }
        return chan.messages[0];
    }
    broadcast(data, ttl = this.ttl) {
        this.messageNumber++;
        const { id, messageNumber } = this;
        let topicString = this.topic.toString("hex");
        let peers = [...this.swarm.peers.values()]
            .filter((peerInfo) => peerInfo._seenTopics.has(topicString))
            .map((peerInfo) => peerInfo.publicKey);
        for (const peer of peers) {
            const conn = this.swarm._allConnections.get(peer);
            if (!conn) {
                continue;
            }
            const message = this.setupPeer(conn);
            message.send({
                originId: id,
                messageNumber,
                ttl,
                data: b4a_1.default.from(data),
            });
        }
    }
    send(peer, data, ttl = this.ttl) {
        this.messageNumber++;
        const { id, messageNumber } = this;
        const message = this.setupPeer(peer);
        message.send({
            originId: id,
            messageNumber,
            ttl,
            data: b4a_1.default.from(data),
        });
    }
}
exports.default = DHTFlood;
