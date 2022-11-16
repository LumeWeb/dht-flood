/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from "events";
export declare const FLOOD_SYMBOL: unique symbol;
export default class DHTFlood extends EventEmitter {
    private id;
    private ttl;
    private messageNumber;
    private lru;
    private swarm;
    private protocol;
    constructor({ lruSize, ttl, messageNumber, id, swarm, protocol, }?: {
        lruSize?: number | undefined;
        ttl?: number | undefined;
        messageNumber?: number | undefined;
        id?: Buffer | undefined;
        swarm?: null | undefined;
        protocol?: string | undefined;
    });
    private handleMessage;
    private setupPeer;
    broadcast(data: any, ttl?: number): void;
    send(peer: any, data: any, ttl?: number): void;
}
//# sourceMappingURL=index.d.ts.map