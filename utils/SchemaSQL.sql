create table
  public.comments (
    comment_id uuid not null default extensions.uuid_generate_v4 (),
    post_id uuid not null,
    user_id uuid not null,
    content text not null,
    created_at timestamp without time zone null default now(),
    updated_at timestamp without time zone null default now(),
    constraint comments_pkey primary key (comment_id),
    constraint comments_post_id_fkey foreign key (post_id) references posts (post_id) on delete cascade,
    constraint comments_user_id_fkey foreign key (user_id) references users (user_id) on delete cascade
  ) tablespace pg_default;

  create table
  public.followers (
    follower_id uuid not null,
    followed_user_id uuid not null,
    constraint followers_pkey primary key (follower_id, followed_user_id),
    constraint followers_followed_user_id_fkey foreign key (followed_user_id) references users (user_id) on delete cascade,
    constraint followers_follower_id_fkey foreign key (follower_id) references users (user_id) on delete cascade
  ) tablespace pg_default;

  create table
  public.likes (
    user_id uuid not null,
    post_id uuid not null,
    constraint likes_pkey primary key (user_id, post_id),
    constraint likes_post_id_fkey foreign key (post_id) references posts (post_id) on delete cascade,
    constraint likes_user_id_fkey foreign key (user_id) references users (user_id) on delete cascade
  ) tablespace pg_default;

  create table
  public.posts (
    post_id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid not null,
    title text not null,
    video text null,
    created_at timestamp without time zone null default now(),
    updated_at timestamp without time zone null default now(),
    like_total integer null,
    view_total integer null,
    constraint posts_pkey primary key (post_id),
    constraint posts_user_id_fkey foreign key (user_id) references users (user_id) on delete cascade
  ) tablespace pg_default;

  create table
  public.posts_topics (
    post_id uuid not null,
    topic_id uuid not null,
    constraint posts_topics_pkey primary key (post_id, topic_id),
    constraint posts_topics_post_id_fkey foreign key (post_id) references posts (post_id) on delete cascade,
    constraint posts_topics_topic_id_fkey foreign key (topic_id) references topics (topic_id) on delete cascade
  ) tablespace pg_default;

  create table
  public.topic_interests (
    user_id uuid not null,
    topic_id uuid not null,
    constraint topic_interests_pkey primary key (user_id, topic_id),
    constraint topic_interests_topic_id_fkey foreign key (topic_id) references topics (topic_id) on delete cascade,
    constraint topic_interests_user_id_fkey foreign key (user_id) references users (user_id) on delete cascade
  ) tablespace pg_default;

  create table
  public.topics (
    topic_id uuid not null default extensions.uuid_generate_v4 (),
    topic_name text not null,
    description text null,
    constraint topics_pkey primary key (topic_id)
  ) tablespace pg_default;

  create table
  public.users (
    user_id uuid not null default extensions.uuid_generate_v4 (),
    username text not null,
    email text not null,
    password_hash text not null,
    first_name text null,
    last_name text null,
    created_at timestamp without time zone null default now(),
    updated_at timestamp without time zone null default now(),
    avatar_url text null,
    follow_total integer null,
    constraint users_pkey primary key (user_id),
    constraint users_email_key unique (email),
    constraint users_username_key unique (username)
  ) tablespace pg_default;

  create table
  public.views (
    view_id uuid not null default extensions.uuid_generate_v4 (),
    post_id uuid not null,
    user_id uuid not null,
    view_at timestamp without time zone null default now(),
    constraint views_pkey primary key (view_id),
    constraint views_post_id_fkey foreign key (post_id) references posts (post_id) on delete cascade,
    constraint views_user_id_fkey foreign key (user_id) references users (user_id) on delete cascade
  ) tablespace pg_default;