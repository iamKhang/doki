import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Dimensions, ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";
import VideoItem from "@/components/VideoItem";
import PostService from "@/services/PostService";

const { height } = Dimensions.get("window");

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Ref to store post IDs to avoid triggering multiple fetches based on `posts` dependency
  const postIdsRef = useRef<string[]>([]);

  const fetchPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const postService = new PostService();
      const newPosts = await postService.getRandomPosts<Post>(
        5,
        postIdsRef.current,
      );

      const uniquePosts = newPosts.filter(
        (newPost) => !postIdsRef.current.includes(newPost.post_id),
      );

      if (uniquePosts.length === 0) {
        // No more unique posts to fetch
        setHasMore(false);
      } else {
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts, ...uniquePosts];
          console.log("Updated posts length:", updatedPosts.length);
          return updatedPosts;
        });

        // Update the ref with new post IDs
        postIdsRef.current = [
          ...postIdsRef.current,
          ...uniquePosts.map((post) => post.post_id),
        ];
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  // Fetch initial posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        const firstViewableIndex = viewableItems[0].index;
        if (firstViewableIndex !== activeIndex) {
          setActiveIndex(firstViewableIndex);
        }
      }
    },
    [activeIndex],
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => {
      const isActive = index === activeIndex;
      return <VideoItem item={item} isActive={isActive} />;
    },
    [activeIndex],
  );

  return (
    <Box style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.post_id.toString()}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        scrollEventThrottle={16}
        maxToRenderPerBatch={3}
        initialNumToRender={3}
        windowSize={1} // Only render 1 screen height of items
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        removeClippedSubviews
        ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
        updateCellsBatchingPeriod={100}
        onEndReached={fetchPosts}
        onEndReachedThreshold={0.5} // Trigger when user is 50% from the bottom
      />
    </Box>
  );
}
