import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Box } from "@/components/ui/box";
import {
  Bookmark,
  ChevronLeft,
  Heart,
  Loader,
  Loader2,
  MessageCircle,
  MoveLeft,
  Play,
  Share2,
  X,
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
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import CommentService, { ExtendedComment } from "@/services/CommentService";
import UserService from "@/services/UserService";
import { HStack } from "../ui/hstack";

const { height } = Dimensions.get("window");

interface VideoItemProps {
  item: Post;
  isActive: boolean;
  onClosed?: () => void;
}

const VideoItem = ({ item, isActive, onClosed }: VideoItemProps) => {
  const videoRef = useRef<Video | null>(null);
  const isPlayingRef = useRef(false);
  const [comments, setComments] = useState<ExtendedComment[] | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [hearted, setHearted] = useState(false);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [shouldShowPlayIcon, setShouldShowPlayIcon] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

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

  useEffect(() => {
    let isMounted = true;

    const managePlayback = async () => {
      // Ensure videoRef.current is still valid when calling async functions
      if (videoRef.current && isVideoLoaded && isMounted) {
        try {
          const status = await videoRef.current.getStatusAsync();

          // Only control playback if the video is loaded and active
          if (status.isLoaded) {
            if (isActive && !status.isPlaying) {
              if (videoRef.current) {
                // Double-check videoRef.current is not null
                await videoRef.current.playAsync();
                if (isMounted) setShouldShowPlayIcon(false);
              }
            } else if (!isActive && status.isPlaying) {
              if (videoRef.current) {
                // Double-check videoRef.current is not null
                await videoRef.current.pauseAsync();
                await videoRef.current.setPositionAsync(0);
                if (isMounted) setShouldShowPlayIcon(true);
              }
            }
          }
        } catch (error) {
          console.error("Error managing playback:", error);
        }
      }
    };

    managePlayback();

    return () => {
      isMounted = false;
    };
  }, [isActive, isVideoLoaded]);

  // Use useFocusEffect to pause the video when the screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // The screen is unfocused
        if (videoRef.current) {
          videoRef.current.pauseAsync();
          setShouldShowPlayIcon(true);
        }
      };
    }, [isVideoLoaded]),
  );

  const handleLoad = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentLoading(true);
        const commentService = new CommentService();
        const comments = await commentService.getByPostId<ExtendedComment>(
          item.post_id,
        );
        setComments(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setCommentLoading(false);
      }
    };

    if (showActionsheet && comments === null) {
      fetchComments();
    }
  }, [showActionsheet]);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        // Fetch owner data
        const userService = new UserService();
        const owner = await userService.getOne<User>(item.user_id);
        setOwner(owner);
      } catch (error) {
        console.error("Error fetching owner:", error);
      }
    };

    if (owner === null) {
      fetchOwner();
    }
  }, []);

  const handlePlaybackStatusUpdate = (status: any) => {
    // Handle playback updates here and manage play/pause when fully loaded
    if (status.isLoaded) {
      isPlayingRef.current = status.isPlaying;
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={handleTap}>
        <Box style={{ width: "100%", height }} className="relative">
          <Video
            ref={videoRef}
            onLoad={handleLoad} // Set video as loaded when ready
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            style={{ width: "100%", height: "100%", backgroundColor: "black" }}
            source={{ uri: item.video || "" }}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false} // Controlled via isActive
            isLooping
          />
          {onClosed && (
            <Button
              variant="link"
              className="absolute left-4 top-4 border-0"
              onPress={onClosed}>
              <X
                color="#fff"
                fill="#fff"
                className="border-white/50 bg-white/30 backdrop-blur-lg"
                size={30}
              />
            </Button>
          )}

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
              <AvatarImage
                source={
                  owner?.avatar_url || require("@/assets/images/avatar.jpg")
                }
              />
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
            <HStack className="items-center gap-2">
              <Text className="text-xl font-semibold text-white drop-shadow-lg">
                {owner?.first_name + " " + owner?.last_name || "Unknown"}
              </Text>
              {owner?.username && (
                <Text className="text-xs font-semibold text-white drop-shadow-lg">
                  (@{owner.username})
                </Text>
              )}
            </HStack>
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
          {commentLoading ? (
            <Center>
              <Loader2 size={30} color="#000" />
            </Center>
          ) : (
            <ScrollView>
              {comments?.map((comment) => (
                <ActionsheetItem key={comment.comment_id} className="mb-4">
                  <CommentItem
                    user_name={
                      comment.user.first_name + " " + comment.user.last_name
                    }
                    text={comment.content}
                    user_avatar={comment.user.avatar_url}
                  />
                </ActionsheetItem>
              ))}
            </ScrollView>
          )}
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
