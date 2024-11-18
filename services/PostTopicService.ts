// services/PostTopicService.ts
import supabase from "@/configs/supabase/supabase";

interface PostTopic {
  post_id: string;
  topic_id: string;
}

export default class PostTopicService {
  /**
   * Lưu các chủ đề đã chọn cho một bài đăng.
   *
   * @param postId - ID của bài đăng.
   * @param selectedTopics - Mảng các chủ đề đã chọn.
   * @returns Promise<void>
   */
  async savePostTopics(
    postId: string,
    selectedTopics: { topic_id: string }[],
  ): Promise<void> {
    if (!postId || !selectedTopics.length) {
      throw new Error("Post ID và danh sách chủ đề không được để trống.");
    }

    const postTopics: PostTopic[] = selectedTopics.map((topic) => ({
      post_id: postId,
      topic_id: topic.topic_id,
    }));

    const { data, error } = await supabase
      .from("posts_topics")
      .insert(postTopics);

    if (error) {
      console.error("Error saving post topics:", error);
      throw error;
    }

    console.log("Post topics saved successfully:", data);
  }
}
