// @generated by protobuf-ts 2.8.1
// @generated from protobuf file "messages.proto" (syntax proto2)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message Packet
 */
export interface PacketType {
  /**
   * @generated from protobuf field: bytes originId = 1;
   */
  originId: Uint8Array;
  /**
   * @generated from protobuf field: uint32 messageNumber = 2;
   */
  messageNumber: number;
  /**
   * @generated from protobuf field: uint32 ttl = 3;
   */
  ttl: number;
  /**
   * @generated from protobuf field: bytes data = 4;
   */
  data: Uint8Array;
}
// @generated message type with reflection information, may provide speed optimized methods
class Packet$Type extends MessageType<PacketType> {
  constructor() {
    super("Packet", [
      { no: 1, name: "originId", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
      {
        no: 2,
        name: "messageNumber",
        kind: "scalar",
        T: 13 /*ScalarType.UINT32*/,
      },
      { no: 3, name: "ttl", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
      { no: 4, name: "data", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
    ]);
  }
  create(value?: PartialMessage<PacketType>): PacketType {
    const message = {
      originId: new Uint8Array(0),
      messageNumber: 0,
      ttl: 0,
      data: new Uint8Array(0),
    };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<PacketType>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: PacketType
  ): PacketType {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes originId */ 1:
          message.originId = reader.bytes();
          break;
        case /* uint32 messageNumber */ 2:
          message.messageNumber = reader.uint32();
          break;
        case /* uint32 ttl */ 3:
          message.ttl = reader.uint32();
          break;
        case /* bytes data */ 4:
          message.data = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(
              `Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`
            );
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(
              this.typeName,
              message,
              fieldNo,
              wireType,
              d
            );
      }
    }
    return message;
  }
  internalBinaryWrite(
    message: PacketType,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* bytes originId = 1; */
    if (message.originId.length)
      writer.tag(1, WireType.LengthDelimited).bytes(message.originId);
    /* uint32 messageNumber = 2; */
    if (message.messageNumber !== 0)
      writer.tag(2, WireType.Varint).uint32(message.messageNumber);
    /* uint32 ttl = 3; */
    if (message.ttl !== 0) writer.tag(3, WireType.Varint).uint32(message.ttl);
    /* bytes data = 4; */
    if (message.data.length)
      writer.tag(4, WireType.LengthDelimited).bytes(message.data);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(
        this.typeName,
        message,
        writer
      );
    return writer;
  }
}
/**
 * @generated MessageType for protobuf message Packet
 */
export const Packet = new Packet$Type();
