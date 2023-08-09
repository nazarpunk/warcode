export const Uint8ArrayBuffer = (u8: Uint8Array): ArrayBuffer =>
    u8.byteLength === u8.buffer.byteLength ? u8.buffer : u8.buffer.slice(0, u8.byteLength)
