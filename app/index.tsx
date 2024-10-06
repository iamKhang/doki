import React, { useRef, useCallback } from "react";
import {
  VirtualizedList,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from "react-native";
import { Video, ResizeMode, Audio } from "expo-av";
import { Box } from "@/components/ui/box";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Play,
  Share2,
} from "lucide-react-native";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { formatNumber } from "@/utils/Format";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { HStack } from "@/components/ui/hstack";
import clsx from "clsx";

const { width, height } = Dimensions.get("window");

// Sử dụng URL video thay vì require()
const videos = [
  {
    uri: "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/sample_video_1.mp4",
  },
  {
    uri: "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/sample_video_2.mp4",
  },
  {
    uri: "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/sample_video_4.mp4",
  },
  {
    uri: "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/sample_video_5.mp4",
  },
  {
    uri: "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/sample_video_6.mp4",
  },
];

// Memoized VideoItem để tránh render lại không cần thiết
const VideoItem = React.memo(
  ({ item, index, handleTap, videoRef, handleOpenActionsheet }: any) => {
    const [hearted, setHearted] = React.useState(false);

    return (
      <TouchableWithoutFeedback onPress={() => handleTap(index)}>
        <Box style={{ width, height }} className="relative">
          <Video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
            }}
            source={{ uri: item.uri }}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping
          />

          {/* Action tab */}
          <VStack
            className={clsx("absolute bottom-8 right-4 items-center gap-4", {
              "bottom-24": Platform.OS === "ios",
            })}>
            <Avatar size="md" className="mb-8">
              <AvatarFallbackText>Jane Doe</AvatarFallbackText>
              <AvatarImage source={require("@/assets/images/avatar.jpg")} />
              <AvatarBadge />
            </Avatar>

            <TouchableWithoutFeedback onPress={() => setHearted(!hearted)}>
              <VStack style={{ alignItems: "center" }}>
                <Heart
                  fill={hearted ? "red" : "white"}
                  color={hearted ? "red" : "white"}
                  size={35}
                />
                <Text className="text-white">
                  {formatNumber(Math.ceil(Math.random() * 100000))}
                </Text>
              </VStack>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={handleOpenActionsheet}>
              <VStack style={{ alignItems: "center" }}>
                <MessageCircle fill="white" color="white" size={35} />
                <Text className="text-white">
                  {formatNumber(Math.ceil(Math.random() * 10000))}
                </Text>
              </VStack>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <VStack style={{ alignItems: "center" }}>
                <Bookmark fill="white" color="white" size={35} />
                <Text className="text-white">
                  {formatNumber(Math.ceil(Math.random() * 1000))}
                </Text>
              </VStack>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <VStack style={{ alignItems: "center" }}>
                <Share2 fill="white" color="white" size={35} />
                <Text className="text-white">
                  {formatNumber(Math.ceil(Math.random() * 100))}
                </Text>
              </VStack>
            </TouchableWithoutFeedback>
          </VStack>

          {/* Bottom tab */}
          <VStack
            className={clsx("absolute bottom-8 left-0 right-0 px-4 pr-[72px]", {
              "bottom-24": Platform.OS === "ios",
            })}>
            <Text className="text-xl font-semibold text-white drop-shadow-lg">
              Doki toptop
            </Text>
            <Text className="text-sm font-semibold text-white drop-shadow-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est optio
              deleniti magni, dolore libero odio iusto doloremque a eveniet,
              veritatis omnis repellendus aliquid nostrum, vero unde earum! Cum,
              id. Explicabo.
            </Text>
          </VStack>
        </Box>
      </TouchableWithoutFeedback>
    );
  },
  (prevProps, nextProps) => prevProps.item === nextProps.item,
);

export default function HomePage() {
  const videoRefs = useRef<Video[]>([]);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);

  const onViewableItemsChanged = useCallback(
    async ({ viewableItems }: { viewableItems: any[] }) => {
      // Lấy danh sách các chỉ số video đang trong khung nhìn
      const visibleIndexes = viewableItems.map((item) => item.index);

      // Lặp qua tất cả các video và tạm dừng những video không nằm trong khung nhìn
      for (let i = 0; i < videoRefs.current.length; i++) {
        const video = videoRefs.current[i];
        if (video) {
          if (!visibleIndexes.includes(i)) {
            // Nếu video không nằm trong khung nhìn, tạm dừng
            await video.pauseAsync();
            await video.setPositionAsync(0); // Tua video về đầu
          } else {
            // Nếu video trong khung nhìn, phát
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            await video.playAsync();
          }
        }
      }
    },
    [],
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const handleTap = useCallback((index: number) => {
    const currentVideo = videoRefs.current[index];
    if (currentVideo) {
      currentVideo.getStatusAsync().then((status) => {
        if (status.isLoaded && status.isPlaying) {
          currentVideo.pauseAsync();
          setIsPlaying(false);
        } else {
          currentVideo.playAsync();
          setIsPlaying(true);
        }
      });
    }
  }, []);

  const getItem = (_data: any, index: number) => videos[index];

  const getItemCount = (_data: any) => videos.length;

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <VideoItem
          item={item}
          index={index}
          handleTap={handleTap}
          handleOpenActionsheet={() => setShowActionsheet(true)}
          videoRef={(ref: Video) => {
            if (ref) {
              videoRefs.current[index] = ref;
            }
          }}
        />
      );
    },
    [handleTap, videos],
  );

  return (
    <>
      <Box
        style={{
          flex: 1,
          position: "relative",
        }}>
        <VirtualizedList
          data={videos}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
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

        {!isPlaying && (
          <Center
            key={"pause iconr"}
            className="absolute left-1/2 top-1/2 -ml-[30px] -mt-[30px] transform opacity-50 transition-transform">
            <Play
              color={"#fff"}
              fill={"#fff"}
              className="border-white/50 bg-white/30 backdrop-blur-lg"
              size={60}
            />
          </Center>
        )}
      </Box>

      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[60]}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetItemText className="text-lg font-semibold">
              {Math.ceil(Math.random() * 100)} Bình luận
            </ActionsheetItemText>
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem className="mb-4">
            <CommentItem user_name="Thanh Cảnh" text="Amazing" />
          </ActionsheetItem>
          <ActionsheetItem className="mb-4">
            <CommentItem user_name="Hoàng Khang" text="Tuyệt vời, quá" />
          </ActionsheetItem>
          <ActionsheetItem className="mb-4">
            <CommentItem
              user_name="Đình Kiên"
              text="Tôi đã bị mất ký ức sau khi xem video này, Tôi đã bị mất ký ức sau khi xem video này, Tôi đã bị mất ký ức sau khi xem video này"
            />
          </ActionsheetItem>
          <ActionsheetItem className="mb-4">
            <CommentItem user_name="Xuân Nam" text="Amazing" />
          </ActionsheetItem>
          <ActionsheetItem className="mb-4">
            <CommentItem user_name="Như Tâm" text="Amazing" />
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}

const CommentItem = ({
  user_name,
  text: content,
}: {
  user_name: string;
  text: string;
}) => {
  return (
    <HStack className="gap-2">
      <Avatar size="md">
        <AvatarFallbackText>{user_name}</AvatarFallbackText>
        <AvatarImage source={require("@/assets/images/avatar.jpg")} />
      </Avatar>
      <VStack className="flex-1">
        <Text className="font-semibold text-secondary-500">{user_name}</Text>
        <Text className="">{content}</Text>
      </VStack>
    </HStack>
  );
};
