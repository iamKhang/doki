import supabase from "@/configs/supabase/supabase";

const BUCKET_NAME = "UPLOAD_BUCKET";

/**
 * Upload a file to the specified bucket.
 *
 * @param filePath - The path where the file will be stored in the bucket.
 * @param file - The file (Blob or File object) to be uploaded.
 * @returns The public URL of the uploaded file if successful, otherwise null.
 */
export async function uploadFile(
  filePath: string,
  file: Blob,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  // Trả về URL công khai
  const publicUrl = await getPublicUrl(filePath);
  return publicUrl;
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
    console.error("Get public URL error:", error.message);
    return null;
  }

  return data?.publicUrl || null;
}
