import React, { useCallback } from "react";
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

const { height } = Dimensions.get("window"); // Use the window height for each item

const VideoItem = ({ item }: { item: Post }) => {
  const videoRef = React.useRef<Video | null>(null);
  const [hearted, setHearted] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [showActionsheet, setShowActionsheet] = React.useState(false);

  const handleTap = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.getStatusAsync().then((status) => {
        if (status.isLoaded && status.isPlaying) {
          videoRef.current?.pauseAsync();
          setIsPlaying(false);
        } else {
          videoRef.current?.playAsync();
          setIsPlaying(true);
        }
      });
    }
  }, []);

  const handleOpenActionsheet = () => {
    setShowActionsheet(true);
  };

  const handleCloseActionsheet = () => {
    setShowActionsheet(false);
  };

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
            isLooping
          />

          {!isPlaying && (
            <Center
              key={"pause icon"}
              className="absolute left-1/2 top-1/2 -ml-[30px] -mt-[30px] transform opacity-50 transition-transform">
              <Play
                color={"#fff"}
                fill={"#fff"}
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

            <TouchableWithoutFeedback onPress={() => setHearted(!hearted)}>
              <VStack style={{ alignItems: "center" }}>
                <Heart
                  fill={hearted ? "red" : "white"}
                  color={hearted ? "red" : "white"}
                  size={35}
                />
                <Text className="text-white">
                  {formatNumber(item.like_total || 0)}
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
              {item.title}
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

      {/* Actionsheet */}
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleCloseActionsheet}
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
          {/* Add more comment items as needed */}
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default VideoItem;
