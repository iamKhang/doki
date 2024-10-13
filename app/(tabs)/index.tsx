import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, Dimensions, ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";
import VideoItem from "@/components/VideoItem";
import PostService from "@/services/PostService";

const { height } = Dimensions.get("window");

export default function HomePage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const postService = new PostService();
      const newPosts = await postService.getRandomPosts<Post>(
        5,
        posts.map((post) => post.post_id),
      );
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => {
          const uniquePosts = newPosts.filter(
            (newPost) =>
              !prevPosts.some((post) => post.post_id === newPost.post_id),
          );
          return [...prevPosts, ...uniquePosts];
        });
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, posts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        const firstViewable = viewableItems[0].item;
        if (firstViewable.post_id !== activeId) {
          setActiveId(firstViewable.post_id);
        }

        if (viewableItems[0].index >= posts.length - 3) {
          fetchPosts();
        }
      }
    },
  ).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const renderItem = useCallback(
    ({ item }: { item: Post }) => {
      const isActive = item.post_id === activeId;
      return <VideoItem item={item} isActive={isActive} />;
    },
    [activeId],
  );

  const ListFooterComponent = () => {
    if (!isLoading) return null;
    return (
      <Box style={{ padding: 16, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </Box>
    );
  };

  return (
    <Box style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.post_id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        scrollEventThrottle={16}
        maxToRenderPerBatch={1}
        initialNumToRender={1}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        removeClippedSubviews
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        windowSize={3}
        updateCellsBatchingPeriod={100}
      />
    </Box>
  );
}
