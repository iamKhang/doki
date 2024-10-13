import React, { useCallback, useEffect, useRef, useState } from "react";
import { TouchableWithoutFeedback, Dimensions, Platform } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Box } from "@/components/ui/box";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Play,
  Share2,
} from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { formatNumber } from "@/utils/Format";
import clsx from "clsx";
import { Center } from "@/components/ui/center";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import CommentItem from "@/components/CommentItem";

const { height } = Dimensions.get("window");

interface VideoItemProps {
  item: Post;
  isActive: boolean;
}

const VideoItem = ({ item, isActive }: VideoItemProps) => {
  const videoRef = useRef<Video | null>(null);
  const isPlayingRef = useRef(false);
  const [hearted, setHearted] = useState(false);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [shouldShowPlayIcon, setShouldShowPlayIcon] = useState(false);

  // Static numbers for counts
  const staticLikeTotal = 1234;
  const staticCommentTotal = 56;
  const staticBookmarkTotal = 78;
  const staticShareTotal = 90;

  const handleTap = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.getStatusAsync().then((status) => {
        if (status.isLoaded && status.isPlaying) {
          videoRef.current?.pauseAsync();
          setShouldShowPlayIcon(true);
        } else if (status.isLoaded) {
          videoRef.current?.playAsync();
          setShouldShowPlayIcon(false);
        }
      });
    }
  }, []);

  const handleOpenActionsheet = useCallback(() => {
    setShowActionsheet(true);
  }, []);

  const handleCloseActionsheet = useCallback(() => {
    setShowActionsheet(false);
  }, []);

  // Control video playback based on isActive
  useEffect(() => {
    let isMounted = true;

    const managePlayback = async () => {
      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync();
        if (isActive) {
          if (status.isLoaded && !status.isPlaying) {
            await videoRef.current.playAsync();
            if (isMounted) setShouldShowPlayIcon(false);
          }
        } else {
          if (status.isLoaded && status.isPlaying) {
            await videoRef.current.pauseAsync();
            await videoRef.current.setPositionAsync(0);
            if (isMounted) setShouldShowPlayIcon(true);
          }
        }
      }
    };

    managePlayback();

    return () => {
      isMounted = false;
    };
  }, [isActive]);

  return (
    <>
      <TouchableWithoutFeedback onPress={handleTap}>
        <Box style={{ width: "100%", height }} className="relative">
          <Video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
            }}
            source={{ uri: item.video || "" }}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false} // Controlled via isActive
            isLooping
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded) {
                isPlayingRef.current = status.isPlaying;
              }
            }}
          />

          {shouldShowPlayIcon && (
            <Center className="absolute left-1/2 top-1/2 -ml-[30px] -mt-[30px] opacity-50">
              <Play
                color="#fff"
                fill="#fff"
                className="border-white/50 bg-white/30 backdrop-blur-lg"
                size={60}
              />
            </Center>
          )}

          {/* Action tab */}
          <VStack
            className={clsx("absolute bottom-8 right-4 items-center gap-4", {
              "bottom-24": Platform.OS === "ios",
            })}>
            <Avatar size="md" className="mb-8">
              <AvatarFallbackText>{item.user_id}</AvatarFallbackText>
              <AvatarImage source={require("@/assets/images/avatar.jpg")} />
              <AvatarBadge />
            </Avatar>

            <TouchableWithoutFeedback
              onPress={() => setHearted((prev) => !prev)}>
              <VStack style={{ alignItems: "center" }}>
                <Heart
                  fill={hearted ? "red" : "white"}
                  color={hearted ? "red" : "white"}
                  size={35}
                />
                <Text className="text-white">
                  {formatNumber(staticLikeTotal)}
                </Text>
              </VStack>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleOpenActionsheet}>
              <VStack style={{ alignItems: "center" }}>
                <MessageCircle fill="white" color="white" size={35} />
                <Text className="text-white">
                  {formatNumber(staticCommentTotal)}
                </Text>
              </VStack>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
              <VStack style={{ alignItems: "center" }}>
                <Bookmark fill="white" color="white" size={35} />
                <Text className="text-white">
                  {formatNumber(staticBookmarkTotal)}
                </Text>
              </VStack>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
              <VStack style={{ alignItems: "center" }}>
                <Share2 fill="white" color="white" size={35} />
                <Text className="text-white">
                  {formatNumber(staticShareTotal)}
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
              @username
            </Text>
            <Text className="text-sm font-semibold text-white drop-shadow-lg">
              {item.title || "No description available."}
            </Text>
          </VStack>
        </Box>
      </TouchableWithoutFeedback>

      {/* Actionsheet */}
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleCloseActionsheet}
        snapPoints={[60]}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetItemText className="text-lg font-semibold">
              {formatNumber(staticCommentTotal)} Bình luận
            </ActionsheetItemText>
          </ActionsheetDragIndicatorWrapper>
          {/* Example static comments */}
          <ActionsheetItem className="mb-4">
            <CommentItem user_name="Thanh Cảnh" text="Amazing" />
          </ActionsheetItem>
          <ActionsheetItem className="mb-4">
            <CommentItem user_name="Hoàng Khang" text="Tuyệt vời, quá" />
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default React.memo(VideoItem, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.item.post_id === nextProps.item.post_id
  );
});
