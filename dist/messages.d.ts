import * as _m0 from "protobufjs/minimal";
export declare const protobufPackage = "";
/** type=0 */
export interface Packet {
    originId: Uint8Array;
    messageNumber: number;
    ttl: number;
    data: Uint8Array;
}
export declare const Packet: {
    encode(message: Packet, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Packet;
    fromJSON(object: any): Packet;
    toJSON(message: Packet): unknown;
    fromPartial<I extends {
        originId?: Uint8Array | undefined;
        messageNumber?: number | undefined;
        ttl?: number | undefined;
        data?: Uint8Array | undefined;
    } & {
        originId?: Uint8Array | undefined;
        messageNumber?: number | undefined;
        ttl?: number | undefined;
        data?: Uint8Array | undefined;
    } & { [K in Exclude<keyof I, keyof Packet>]: never; }>(object: I): Packet;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
declare type KeysOfUnion<T> = T extends T ? keyof T : never;
export declare type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
//# sourceMappingURL=messages.d.ts.map