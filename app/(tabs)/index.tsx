import React, { useRef, useCallback } from "react";
import { VirtualizedList, Dimensions } from "react-native";
import { Video, Audio } from "expo-av";
import { Box } from "@/components/ui/box";
import VideoItem from "@/components/VideoItem";

const { height } = Dimensions.get("window");

// Sample posts array with video URLs
const posts: Post[] = [
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

  // Handle visible items and play/pause videos
  const onViewableItemsChanged = useCallback(
    async ({ viewableItems }: { viewableItems: any[] }) => {
      const visibleIndexes = viewableItems.map((item) => item.index);
      for (let i = 0; i < videoRefs.current.length; i++) {
        const video = videoRefs.current[i];
        if (video) {
          if (!visibleIndexes.includes(i)) {
            await video.pauseAsync();
            await video.setPositionAsync(0); // Reset to the beginning
          } else {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            await video.playAsync();
          }
        }
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
  const renderItem = useCallback(({ item }: { item: Post }) => {
    return <VideoItem item={item} />;
  }, []);

  return (
    <Box style={{ flex: 1, position: "relative" }}>
      <VirtualizedList
        data={posts} // List of posts
        renderItem={renderItem} // Render each item
        keyExtractor={(item) => item.post_id}
        pagingEnabled // Enable paging for full-screen items
        showsVerticalScrollIndicator={false} // Hide scroll indicator
        onViewableItemsChanged={onViewableItemsChanged} // Handle viewable item changes
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={height} // Snap each item to the height of the screen
        snapToAlignment="start"
        scrollEventThrottle={16}
        maxToRenderPerBatch={1} // Render one item at a time
        initialNumToRender={1} // Initially render only one item
        getItem={getItem}
        getItemCount={getItemCount}
        getItemLayout={(_, index) => ({
          length: height, // Each item has the full height of the screen
          offset: height * index,
          index,
        })}
        removeClippedSubviews // Remove views outside of the window to improve memory usage
      />
    </Box>
  );
}
