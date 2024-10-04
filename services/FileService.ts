import supabase from "@/configs/supabase";
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
  file: File | Blob,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  // Return the public URL of the uploaded file
  return getPublicUrl(filePath);
}

/**
 * Get the public URL of a file in the bucket.
 *
 * @param filePath - The path of the file in the bucket.
 * @returns The public URL of the file or null if not found.
 */
export async function getPublicUrl(filePath: string): Promise<string | null> {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return data?.publicUrl || null;
}
