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
  file: File | Blob,
): Promise<string | null> {
  console.log("FILE", file);

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: "video/mp4",
      });

    console.log("DATA", data);
  } catch (error) {
    console.error("ERROR HERE Upload error:", error);
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

  if (!data) {
    console.error("Get public URL error: No data returned");
    return null;
  }

  return data?.publicUrl || null;
}
