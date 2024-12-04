import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  FlatList,
  Dimensions,
  ActivityIndicator,
  View,
  Platform,
} from "react-native";
import { Box } from "@/components/ui/box";
import PostService from "@/services/PostService";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useIsFocused } from "@react-navigation/native";
import { memo } from "react";
import VideoItem from "@/components/VideoItem";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const getItemLayout = (_: any, index: number, height: number) => ({
  length: height,
  offset: height * index,
  index,
});

const MemoizedVideoItem = memo(
  ({ item, isActive }: { item: Post; isActive: boolean }) => (
    <VideoItem item={item} isActive={isActive} />
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.item.post_id === nextProps.item.post_id &&
      prevProps.isActive === nextProps.isActive
    );
  },
);

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

  const keyExtractor = useCallback((item: Post) => item.post_id.toString(), []);

  const memoizedGetItemLayout = useCallback(
    (_: any, index: number) => getItemLayout(_, index, contentHeight),
    [contentHeight],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => (
      <Box style={{ height: contentHeight }}>
        <MemoizedVideoItem
          item={item}
          isActive={index === activeIndex && isFocused}
        />
      </Box>
    ),
    [activeIndex, isFocused, contentHeight],
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

  // Add momentum scroll handling
  const onMomentumScrollEnd = useCallback(
    (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const newIndex = Math.round(offsetY / contentHeight);
      setActiveIndex(newIndex);
    },
    [contentHeight],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={memoizedGetItemLayout}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      showsVerticalScrollIndicator={false}
      decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
      snapToInterval={contentHeight}
      snapToAlignment="start"
      disableIntervalMomentum={true}
      pagingEnabled={true}
      scrollEventThrottle={16}
      onMomentumScrollEnd={onMomentumScrollEnd}
      maxToRenderPerBatch={2}
      initialNumToRender={1}
      windowSize={2}
      removeClippedSubviews={Platform.OS === "android"}
      updateCellsBatchingPeriod={75}
      ListFooterComponent={ListFooterComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
      style={{ flex: 1 }}
    />
  );
}
