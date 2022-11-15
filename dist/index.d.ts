/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from "events";
export default class DHTFlood extends EventEmitter {
    private id;
    private ttl;
    private messageNumber;
    private lru;
    private swarm;
    constructor({ lruSize, ttl, messageNumber, id, swarm, }?: {
        lruSize?: number | undefined;
        ttl?: number | undefined;
        messageNumber?: number | undefined;
        id?: Buffer | undefined;
        swarm?: null | undefined;
    });
    private handleMessage;
    private setupPeer;
    broadcast(data: any, ttl?: number): void;
}
//# sourceMappingURL=index.d.ts.map