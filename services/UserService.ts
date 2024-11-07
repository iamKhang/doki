import supabase from "@/configs/supabase/supabase";

interface IUserService extends QueryService {
  getUsersByPage<User>(page: number, pageSize: number): Promise<User[]>;
  search: (query: string) => Promise<any>;
}

export default class UserService implements IUserService {
  async getOne<User>(id: string): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", id)
      .maybeSingle();
    if (error) throw error;
    return data as User;
  }

  async getAll<User>(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data as User[];
  }

  async create<User>(data: User): Promise<User> {
    const { data: createdData, error } = await supabase
      .from("users")
      .insert(data as any)
      .single();
    if (error) throw error;
    return createdData as User;
  }

  async update<User>(id: string, data: User): Promise<User> {
    const { data: updatedData, error } = await supabase
      .from("users")
      .update(data as any)
      .eq("user_id", id)
      .single();
    if (error) throw error;
    return updatedData as User;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("user_id", id);
    if (error) throw error;
  }

  async getUsersByPage<User>(page: number, pageSize: number): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;
    return data as User[];
  }

  async search(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .textSearch("name", query, { type: "websearch" })
      .limit(10)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as User[];
  }
}
