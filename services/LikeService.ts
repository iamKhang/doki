import supabase from "@/configs/supabase/supabase";
import { Database } from "@/configs/supabase/database.types";

type Like = Database["public"]["Tables"]["likes"]["Row"];

export default class LikeService {
  async toggleLike(postId: string, userId: string): Promise<boolean> {
    // Check if like exists
    const { data: existingLike } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingLike) {
      // Unlike
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;
      return false;
    } else {
      // Like
      const { error: insertError } = await supabase.from("likes").insert({
        post_id: postId,
        user_id: userId,
        like_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;
      return true;
    }
  }

  async checkIfLiked(postId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    return !!data;
  }
}
