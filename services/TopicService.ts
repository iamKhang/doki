import supabase from "@/configs/supabase/supabase";

interface ITopicService {
  getAll<Topic>(): Promise<Topic[]>;
  getOne<Topic>(id: string): Promise<Topic>;
  create<Topic>(data: Topic): Promise<Topic>;
  update<Topic>(id: string, data: Topic): Promise<Topic>;
  delete(id: string): Promise<void>;
  search<Topic>(query: string): Promise<Topic[]>;
  getTopicsByPage<Topic>(page: number, pageSize: number): Promise<Topic[]>;
}

export default class TopicService implements ITopicService {
  async getAll<Topic>(): Promise<Topic[]> {
    const { data, error } = await supabase.from("topics").select("*");
    if (error) throw error;
    return data as Topic[];
  }

  async getOne<Topic>(id: string): Promise<Topic> {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .eq("topic_id", id)
      .maybeSingle();
    if (error) throw error;
    return data as Topic;
  }

  async create<Topic>(data: Topic): Promise<Topic> {
    const { data: createdData, error } = await supabase
      .from("topics")
      .insert(data as any)
      .single();
    if (error) throw error;
    return createdData as Topic;
  }

  async update<Topic>(id: string, data: Topic): Promise<Topic> {
    const { data: updatedData, error } = await supabase
      .from("topics")
      .update(data as any)
      .eq("topic_id", id)
      .single();
    if (error) throw error;
    return updatedData as Topic;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("topics").delete().eq("topic_id", id);
    if (error) throw error;
  }

  async search<Topic>(query: string): Promise<Topic[]> {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .textSearch("topic_name", query, { type: "websearch" })
      .limit(10)
      .order("topic_name", { ascending: true });

    if (error) throw error;
    return data as Topic[];
  }

  async getTopicsByPage<Topic>(
    page: number,
    pageSize: number,
  ): Promise<Topic[]> {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .order("topic_name", { ascending: true })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;
    return data as Topic[];
  }
}
