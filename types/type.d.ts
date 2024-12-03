declare global {
  type UUID = string;

  interface PostComment {
    comment_id: UUID;
    post_id: UUID;
    user_id: UUID;
    content: string;
    created_at?: string;
    updated_at?: string;
  }

  interface Follower {
    follower_id: UUID;
    followed_user_id: UUID;
  }

  interface Like {
    user_id: UUID;
    post_id: UUID;
  }

  interface Post {
    post_id: UUID;
    user_id: UUID;
    title: string;
    video?: string;
    created_at?: string;
    updated_at?: string;
    like_total?: number;
    view_total?: number;
    thumbnail_url?: string;
  }

  interface PostsTopics {
    post_id: UUID;
    topic_id: UUID;
  }

  interface TopicInterest {
    user_id: UUID;
    topic_id: UUID;
  }

  interface Topic {
    topic_id: UUID;
    topic_name: string;
    description?: string;
  }

  interface User {
    user_id: UUID;
    username: string;
    email: string;
    password_hash: string;
    first_name?: string;
    last_name?: string;
    created_at?: string;
    updated_at?: string;
    avatar_url?: string;
    follow_total?: number;
  }

  interface View {
    view_id: UUID;
    post_id: UUID;
    user_id: UUID;
    view_at?: string;
  }

  interface QueryService {
    getOne: <T>(id: string) => Promise<T>;
    getAll: <T>() => Promise<T[]>;
    create: <T>(data: T) => Promise<T>;
    update: <T>(id: string, data: T) => Promise<T>;
    delete: (id: string) => Promise<void>;
  }
}

export {};
