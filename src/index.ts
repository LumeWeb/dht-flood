import EventEmitter from "events";
import crypto from "crypto";
// @ts-ignore
import LRU from "lru";
import debug0 from "debug";
// @ts-ignore
import Protomux from "protomux";
import {Packet} from "./messages.js";
// @ts-ignore
import c from "compact-encoding"
import b4a from "b4a"

const debug = debug0('dht-flood')

const LRU_SIZE = 255
const TTL = 255
const PROTOCOL = "lumeweb.flood"

const FLOOD_SYMBOL = Symbol.for(PROTOCOL)

export default class DHTFlood extends EventEmitter {
    private id: Buffer;
    private ttl: number;
    private messageNumber: number;
    private lru: LRU;
    private swarm: any;
    private mux: any;

    constructor({
                    lruSize = LRU_SIZE,
                    ttl = TTL,
                    messageNumber = 0,
                    id = crypto.randomBytes(32),
                    swarm = null
                } = {}) {
        super()

        this.id = id
        this.ttl = ttl
        this.messageNumber = messageNumber
        this.lru = new LRU(lruSize)
        if (!swarm) {
            throw new Error('swarm is required');
        }
        this.swarm = swarm;

        this.swarm.on("connection", (peer: any) => {
            const mux = Protomux.from(peer);
            mux.pair({protocol: PROTOCOL}, () => this.setupPeer(peer));
        });
    }

    private handleMessage({originId, messageNumber, ttl, data}: Packet, messenger: any) {
        const originIdBuf = b4a.from(originId) as Buffer;

        // Ignore messages from ourselves
        if (originIdBuf.equals(this.id)) return debug('Got message from self', originId, messageNumber)

        // Ignore messages we've already seen
        const key = originIdBuf.toString('hex') + messageNumber
        if (this.lru.get(key)) return debug('Got message that was already seen', originId, messageNumber)
        this.lru.set(key, true)

        this.emit('message', data, originId, messageNumber)

        if (ttl <= 0) return debug('Got message at end of TTL', originId, messageNumber, ttl)

        messenger.send({
            originId,
            messageNumber,
            data,
            ttl: ttl - 1
        });

    }

    private setupPeer(peer: any) {
        const mux = Protomux.from(peer);
        let chan: any;

        if (!mux.opened({protocol: PROTOCOL})) {
            chan = mux.createChannel({
                protocol: PROTOCOL,
            });
            peer[FLOOD_SYMBOL] = chan;
        }

        chan = peer[FLOOD_SYMBOL];

        if (!chan) {
            throw new Error('could not find channel');
        }

        if (!chan.messages.length) {
            chan.addMessage({
                encoding: {
                    preencode: (state: any, m: any) => c.raw.preencode(state, Packet.encode(m).finish()),
                    encode: (state: any, m: any) => c.raw.encode(state, Packet.encode(m).finish()),
                    decode: (state: any) => Packet.decode(c.raw.decode(state)),
                },
                onmessage: (msg: any) => this.handleMessage(msg, chan.messages[0]),
            })
        }

        if (!chan.opened) {
            chan.open();
        }

        return chan.messages[0];
    }

    broadcast(data: any, ttl = this.ttl) {
        this.messageNumber++
        const {id, messageNumber} = this

        for (const peer of this.swarm.connections.values()) {
            const message = this.setupPeer(peer);
            message.send({
                originId: id,
                messageNumber,
                ttl,
                data
            })
        }
    }
}
