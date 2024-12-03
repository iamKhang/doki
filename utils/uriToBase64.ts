// utils/uriToBase64.ts
import * as FileSystem from "expo-file-system";

/**
 * Chuyển đổi URI thành chuỗi Base64.
 *
 * @param uri - URI của tệp tin.
 * @returns Promise<string>
 */
export const uriToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting URI to Base64:", error);
    throw error;
  }
};
