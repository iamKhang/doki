import supabase from "@/configs/supabase/supabase";

interface IPostService extends QueryService {
  getPostsByPage<Post>(page: number, pageSize: number): Promise<Post[]>;
  getRandomPosts<Post>(limit: number, excludeIds: string[]): Promise<Post[]>;
  search: (query: string) => Promise<any>;
}
export default class PostService implements IPostService {
  async getOne<Post>(id: string): Promise<Post> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("post_id", id)
      .single();
    if (error) throw error;
    return data as Post;
  }

  async getAll<Post>(): Promise<Post[]> {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) throw error;
    return data as Post[];
  }

  async create<Post>(data: Post): Promise<Post> {
    const { data: createdData, error } = await supabase
      .from("posts")
      .insert(data as any)
      .select("*")
      .single();
    if (error) throw error;
    return createdData as Post;
  }

  async update<Post>(id: string, data: Post): Promise<Post> {
    const { data: updatedData, error } = await supabase
      .from("posts")
      .update(data as any)
      .eq("post_id", id)
      .single();
    if (error) throw error;
    return updatedData as Post;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("posts").delete().eq("post_id", id);
    if (error) throw error;
  }

  // Phương thức mới để lấy các bài viết theo trang
  async getPostsByPage<Post>(page: number, pageSize: number): Promise<Post[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false }) // Sắp xếp theo thời gian tạo
      .range(page * pageSize, (page + 1) * pageSize - 1); // Tính toán offset dựa trên trang và kích thước trang

    if (error) throw error;
    return data as Post[];
  }

  async getPostsByUser<Post>(
    page: number,
    pageSize: number,
    user: User,
    isPrivate?: boolean,
  ): Promise<Post[]> {
    let query = supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.user_id)
      .order("created_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (isPrivate !== undefined) {
      query = query.eq("private", isPrivate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Post[];
  }

  async getRandomPosts<Post>(
    limit: number,
    excludeIds: string[],
  ): Promise<Post[]> {
    const { data, error } = await supabase.rpc("get_random_posts", {
      exclude_ids: excludeIds, // Truyền mảng post_id cần loại bỏ dưới dạng UUID[]
      limit_size: limit, // Giới hạn số lượng bài viết
    });

    if (error) throw error;
    return data as Post[];
  }

  async search(query: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .textSearch("title", query, { type: "websearch" })
      .limit(10)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Post[];
  }

  async getLikeStatus(postId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // Ignore not found error
    return !!data;
  }
}
