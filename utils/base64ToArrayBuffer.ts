// utils/base64ToArrayBuffer.ts
import { Buffer } from "buffer";

/**
 * Chuyển đổi chuỗi Base64 thành ArrayBuffer.
 *
 * @param base64 - Chuỗi Base64 của tệp tin.
 * @returns ArrayBuffer
 */
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const buffer = Buffer.from(base64, "base64");
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
};
