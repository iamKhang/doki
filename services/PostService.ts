import supabase from "@/configs/supabase/supabase";

interface QueryService {
  getOne: <T>(id: string) => Promise<T>;
  getAll: <T>() => Promise<T[]>;
  create: <T>(data: T) => Promise<T>;
  update: <T>(id: string, data: T) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

export default class PostService implements QueryService {
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
}
