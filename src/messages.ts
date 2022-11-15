/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

/** type=0 */
export interface Packet {
  originId: Uint8Array;
  messageNumber: number;
  ttl: number;
  data: Uint8Array;
}

function createBasePacket(): Packet {
  return { originId: new Uint8Array(), messageNumber: 0, ttl: 0, data: new Uint8Array() };
}

export const Packet = {
  encode(message: Packet, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.originId.length !== 0) {
      writer.uint32(10).bytes(message.originId);
    }
    if (message.messageNumber !== 0) {
      writer.uint32(16).uint32(message.messageNumber);
    }
    if (message.ttl !== 0) {
      writer.uint32(24).uint32(message.ttl);
    }
    if (message.data.length !== 0) {
      writer.uint32(34).bytes(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Packet {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePacket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.originId = reader.bytes();
          break;
        case 2:
          message.messageNumber = reader.uint32();
          break;
        case 3:
          message.ttl = reader.uint32();
          break;
        case 4:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Packet {
    return {
      originId: isSet(object.originId) ? bytesFromBase64(object.originId) : new Uint8Array(),
      messageNumber: isSet(object.messageNumber) ? Number(object.messageNumber) : 0,
      ttl: isSet(object.ttl) ? Number(object.ttl) : 0,
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
    };
  },

  toJSON(message: Packet): unknown {
    const obj: any = {};
    message.originId !== undefined &&
      (obj.originId = base64FromBytes(message.originId !== undefined ? message.originId : new Uint8Array()));
    message.messageNumber !== undefined && (obj.messageNumber = Math.round(message.messageNumber));
    message.ttl !== undefined && (obj.ttl = Math.round(message.ttl));
    message.data !== undefined &&
      (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Packet>, I>>(object: I): Packet {
    const message = createBasePacket();
    message.originId = object.originId ?? new Uint8Array();
    message.messageNumber = object.messageNumber ?? 0;
    message.ttl = object.ttl ?? 0;
    message.data = object.data ?? new Uint8Array();
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
