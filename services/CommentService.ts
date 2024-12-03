import supabase from "@/configs/supabase/supabase";

interface ICommentService extends QueryService {
  getCommentsByPage<PostComment>(
    page: number,
    pageSize: number,
  ): Promise<PostComment[]>;
  search: (query: string) => Promise<any>;
  getByPostId<ExtendedComment>(postId: string): Promise<ExtendedComment[]>;
}

export interface ExtendedComment extends PostComment {
  user: User;
}

export default class CommentService implements ICommentService {
  async getByPostId<ExtendedComment>(
    postId: string,
  ): Promise<ExtendedComment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*, user:users(*)")
      .eq("post_id", postId);

    if (error) throw error;
    return data as ExtendedComment[];
  }

  async getOne<PostComment>(id: string): Promise<PostComment> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("comment_id", id)
      .maybeSingle();
    if (error) throw error;
    return data as PostComment;
  }

  async getAll<PostComment>(): Promise<PostComment[]> {
    const { data, error } = await supabase.from("comments").select("*");
    if (error) throw error;
    return data as PostComment[];
  }

  async create<ExtendedComment>(data: any): Promise<ExtendedComment> {
    const { data: createdData, error } = await supabase
      .from("comments")
      .insert([data as any])
      .select("*, user:users(*)")
      .single();
    if (error) throw error;
    return createdData as ExtendedComment;
  }

  async update<PostComment>(
    id: string,
    data: PostComment,
  ): Promise<PostComment> {
    const { data: updatedData, error } = await supabase
      .from("comments")
      .update(data as any)
      .eq("comment_id", id)
      .single();
    if (error) throw error;
    return updatedData as PostComment;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("comment_id", id);
    if (error) throw error;
  }

  async getCommentsByPage<PostComment>(
    page: number,
    pageSize: number,
  ): Promise<PostComment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;
    return data as PostComment[];
  }

  async search(query: string): Promise<PostComment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .textSearch("content", query, { type: "websearch" })
      .limit(10)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as PostComment[];
  }
}
