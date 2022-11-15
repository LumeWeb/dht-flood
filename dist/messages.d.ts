import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
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
declare class Packet$Type extends MessageType<PacketType> {
    constructor();
    create(value?: PartialMessage<PacketType>): PacketType;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PacketType): PacketType;
    internalBinaryWrite(message: PacketType, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message Packet
 */
export declare const Packet: Packet$Type;
export {};
//# sourceMappingURL=messages.d.ts.map