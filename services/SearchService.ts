import supabase from "@/configs/supabase/supabase";
import { Database } from "@/configs/supabase/database.types";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];
type Topic = Database["public"]["Tables"]["topics"]["Row"];

export interface SearchResults {
  posts: Post[];
  users: User[];
  topics: Topic[];
}

export default class SearchService {
  async searchAll(query: string): Promise<SearchResults> {
    const [posts, users, topics] = await Promise.all([
      this.searchPosts(query),
      this.searchUsers(query),
      this.searchTopics(query),
    ]);

    return {
      posts,
      users,
      topics,
    };
  }

  async searchPosts(query: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .or(`title.ilike.%${query}%`)
      .limit(10)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Post[];
  }

  async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(
        `username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`,
      )
      .limit(10)
      .order("username", { ascending: true });

    if (error) throw error;
    return data;
  }

  async searchTopics(query: string): Promise<Topic[]> {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .or(`topic_name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(10)
      .order("topic_name", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Search posts by topic
  async searchPostsByTopic(topicId: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        posts_topics!inner(topic_id)
      `,
      )
      .eq("posts_topics.topic_id", topicId)
      .limit(10)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Post[];
  }

  // Search posts by user
  async searchPostsByUser(userId: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .limit(10)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  // Advanced search with filters
  async advancedSearch({
    query,
    topicIds,
    userId,
    startDate,
    endDate,
    sortBy = "created_at",
    sortOrder = "desc",
    limit = 10,
  }: {
    query?: string;
    topicIds?: string[];
    userId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: "created_at" | "like_total" | "view_total";
    sortOrder?: "asc" | "desc";
    limit?: number;
  }): Promise<(Post & { user: User })[]> {
    let queryBuilder = supabase.from("posts").select(`
        *,
        user:users(*)
      `);

    // Apply text search if query exists
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`);
    }

    // Filter by user if userId provided
    if (userId) {
      queryBuilder = queryBuilder.eq("user_id", userId);
    }

    // Filter by date range if provided
    if (startDate) {
      queryBuilder = queryBuilder.gte("created_at", startDate);
    }
    if (endDate) {
      queryBuilder = queryBuilder.lte("created_at", endDate);
    }

    // Filter by topics if provided
    if (topicIds && topicIds.length > 0) {
      const { data: topicPostIds } = await supabase
        .from("posts_topics")
        .select("post_id")
        .in("topic_id", topicIds);

      if (topicPostIds) {
        queryBuilder = queryBuilder.in(
          "post_id",
          topicPostIds.map((row) => row.post_id),
        );
      }
    }

    // Apply sorting and limit
    const { data, error } = await queryBuilder
      .order(sortBy, { ascending: sortOrder === "asc" })
      .limit(limit);

    if (error) throw error;
    return data as (Post & { user: User })[];
  }
}
