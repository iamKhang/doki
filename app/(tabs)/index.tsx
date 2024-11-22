import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { FlatList, Dimensions, ActivityIndicator, View } from "react-native";
import { Box } from "@/components/ui/box";
import VideoItem from "@/components/VideoItem";
import PostService from "@/services/PostService";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useIsFocused } from "@react-navigation/native";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

export default function HomePage() {
  const tabBarHeight = useTabBarHeight();
  const contentHeight = WINDOW_HEIGHT - tabBarHeight;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Refs
  const postIdsRef = useRef<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const isFocused = useIsFocused();

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
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...uniquePosts]);
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

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Memoized configs and handlers
  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 80,
      minimumViewTime: 100,
    }),
    [],
  );

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig,
      onViewableItemsChanged: ({ viewableItems }: { viewableItems: any[] }) => {
        if (viewableItems && viewableItems.length > 0) {
          const firstViewableIndex = viewableItems[0].index;
          if (firstViewableIndex !== activeIndex) {
            setActiveIndex(firstViewableIndex);
          }
        }
      },
    },
  ]);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: contentHeight,
      offset: contentHeight * index,
      index,
    }),
    [contentHeight],
  );

  const keyExtractor = useCallback((item: Post) => item.post_id.toString(), []);

  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => (
      <VideoItem item={item} isActive={index === activeIndex && isFocused} />
    ),
    [activeIndex, isFocused],
  );

  const ListFooterComponent = useCallback(
    () =>
      isLoading ? (
        <View style={{ height: 50, justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : null,
    [isLoading],
  );

  const onEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPosts();
    }
  }, [fetchPosts, isLoading, hasMore]);

  return (
    <Box style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={contentHeight}
        snapToAlignment="start"
        scrollEventThrottle={16}
        maxToRenderPerBatch={3}
        initialNumToRender={2}
        windowSize={3}
        removeClippedSubviews={true}
        ListFooterComponent={ListFooterComponent}
        updateCellsBatchingPeriod={50}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        style={{ flex: 1 }}
      />
    </Box>
  );
}
