// utils/generateThumbnail.js

import * as VideoThumbnails from "expo-video-thumbnails";

/**
 * Generates a thumbnail from a video.
 * @param {string} videoUri - The URI of the video.
 * @param {number} timeInSeconds - The time in seconds to capture the thumbnail.
 * @returns {Promise<string | null>} - The URI of the generated thumbnail or null if an error occurs.
 */
export async function generateThumbnail(videoUri, timeInSeconds) {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: timeInSeconds * 1000, // Convert seconds to milliseconds
    });
    return uri;
  } catch (error) {
    console.warn("Thumbnail generation error:", error);
    return null;
  }
}
