// services/FileService.ts
import supabase from "@/configs/supabase/supabase";

const BUCKET_NAME = "UPLOAD_BUCKET";

/**
 * Upload a file to the specified bucket using ArrayBuffer.
 *
 * @param filePath - The path where the file will be stored in the bucket.
 * @param arrayBuffer - The ArrayBuffer of the file to be uploaded.
 * @param contentType - The MIME type of the file.
 * @returns The public URL of the uploaded file if successful, otherwise null.
 */
export async function uploadFile(
  filePath: string,
  arrayBuffer: ArrayBuffer,
  contentType: string = "video/mp4", // Mặc định là video/mp4
): Promise<string | null> {
  console.log("Uploading file:", filePath);

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, arrayBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType, // Sử dụng contentType được truyền vào
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    console.log("Upload successful:", data);
  } catch (error) {
    console.error("ERROR HERE Upload error:", error);
    return null;
  }

  // Return the public URL of the uploaded file
  return await getPublicUrl(filePath);
}

/**
 * Get the public URL of a file in the bucket.
 *
 * @param filePath - The path of the file in the bucket.
 * @returns The public URL of the file or null if not found.
 */
export async function getPublicUrl(filePath: string): Promise<string | null> {
  const { data, error } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  if (error) {
    console.error("Get public URL error:", error);
    return null;
  }

  return data?.publicUrl || null;
}
