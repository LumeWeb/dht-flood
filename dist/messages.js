"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = void 0;
const runtime_1 = require("@protobuf-ts/runtime");
const runtime_2 = require("@protobuf-ts/runtime");
const runtime_3 = require("@protobuf-ts/runtime");
const runtime_4 = require("@protobuf-ts/runtime");
const runtime_5 = require("@protobuf-ts/runtime");
// @generated message type with reflection information, may provide speed optimized methods
class Packet$Type extends runtime_5.MessageType {
    constructor() {
        super("Packet", [
            { no: 1, name: "originId", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 2, name: "messageNumber", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 3, name: "ttl", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 4, name: "data", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value) {
        const message = { originId: new Uint8Array(0), messageNumber: 0, ttl: 0, data: new Uint8Array(0) };
        globalThis.Object.defineProperty(message, runtime_4.MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            (0, runtime_3.reflectionMergePartial)(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
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
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? runtime_2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bytes originId = 1; */
        if (message.originId.length)
            writer.tag(1, runtime_1.WireType.LengthDelimited).bytes(message.originId);
        /* uint32 messageNumber = 2; */
        if (message.messageNumber !== 0)
            writer.tag(2, runtime_1.WireType.Varint).uint32(message.messageNumber);
        /* uint32 ttl = 3; */
        if (message.ttl !== 0)
            writer.tag(3, runtime_1.WireType.Varint).uint32(message.ttl);
        /* bytes data = 4; */
        if (message.data.length)
            writer.tag(4, runtime_1.WireType.LengthDelimited).bytes(message.data);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? runtime_2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Packet
 */
exports.Packet = new Packet$Type();
