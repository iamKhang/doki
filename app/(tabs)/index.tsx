import React, { useRef, useCallback, useState } from "react";
import { VirtualizedList, Dimensions } from "react-native";
import { Video, Audio } from "expo-av";
import { Box } from "@/components/ui/box";
import VideoItem from "@/components/VideoItem";

const { height } = Dimensions.get("window");

// Sample posts array with video URLs
const samplePosts: Post[] = [
  {
    post_id: "1",
    user_id: "101",
    title: "Video 1",
    video:
      "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/sample_video_1.mp4",
    like_total: 100,
    view_total: 1000,
  },
  {
    post_id: "2",
    user_id: "102",
    title: "Video 2",
    video:
      "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/sample_video_2.mp4",
    like_total: 200,
    view_total: 1500,
  },
  // Add more posts here
];

export default function HomePage() {
  const videoRefs = useRef<Video[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>(samplePosts);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index); // Set the active item based on the first viewable item
      }
    },
    [],
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80, // At least 80% of the item should be visible to be considered "viewable"
  };

  const getItem = (_data: any, index: number) => posts[index];
  const getItemCount = (_data: any) => posts.length;

  // Render each video item
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isActive = index === activeIndex; // Determine if the current item is active
      return <VideoItem item={item} isActive={isActive} />;
    },
    [activeIndex],
  );

  return (
    <Box style={{ flex: 1 }}>
      <VirtualizedList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.post_id}
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
        getItem={getItem}
        getItemCount={getItemCount}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        removeClippedSubviews
      />
    </Box>
  );
}
