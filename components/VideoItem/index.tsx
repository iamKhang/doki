import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Box } from "@/components/ui/box";
import {
  Bookmark,
  Heart,
  MessageCircle,
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
import { Button } from "../ui/button";
import CommentService, { ExtendedComment } from "@/services/CommentService";
import UserService from "@/services/UserService";
import { HStack } from "../ui/hstack";
import { Spinner } from "../ui/spinner";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useEvent } from "expo";

const { height } = Dimensions.get("window");

interface VideoItemProps {
  item: Post;
  isActive: boolean;
  onClosed?: () => void;
}

const VideoItem = ({ item, isActive, onClosed }: VideoItemProps) => {
  const tabBarHeight = useTabBarHeight();
  const contentHeight = height - tabBarHeight;

  const [isPaused, setIsPaused] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [playerError, setPlayerError] = useState<Error | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayer(item.video || null, (player) => {
    player.loop = true;
  });

  const playerRef = useRef(player);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    playerRef.current = player;
    isPlayingRef.current = isPlaying;
  }, [player, isPlaying]);

  useEffect(() => {
    if (!player) return;

    const playingSubscription = player.addListener(
      "playingChange",
      ({ isPlaying }) => {
        setIsPlaying(isPlaying);
        isPlayingRef.current = isPlaying;
      },
    );

    const statusSubscription = player.addListener(
      "statusChange",
      ({ status }) => {
        if (status === "readyToPlay") {
          setIsVideoReady(true);
          setPlayerError(null);
        } else if (status === "error") {
          setIsVideoReady(false);
          setPlayerError(new Error("Failed to load video"));
        }
      },
    );

    return () => {
      playingSubscription.remove();
      statusSubscription.remove();
    };
  }, [player]);

  const handleTap = useCallback(() => {
    if (!isVideoReady || !playerRef.current) return;

    try {
      if (isPlayingRef.current) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    } catch (error) {
      console.error("Error handling tap:", error);
      setPlayerError(error as Error);
    }
  }, [isVideoReady]);

  useEffect(() => {
    if (!player || !isVideoReady) return;

    let mounted = true;

    const handlePlayback = async () => {
      try {
        if (!mounted || !player) return;

        if (isActive && !isPaused) {
          await player.play();
        } else {
          await player.pause();
        }
      } catch (error) {
        console.error("Error handling playback:", error);
        if (mounted) {
          setPlayerError(error as Error);
        }
      }
    };

    handlePlayback();

    return () => {
      mounted = false;
      try {
        if (player) {
          player.pause();
        }
      } catch (error) {
        // Ignore cleanup errors
        console.debug("Cleanup error:", error);
      }
    };
  }, [isActive, isPaused, player, isVideoReady]);

  const [comments, setComments] = useState<ExtendedComment[] | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [hearted, setHearted] = useState(false);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      if (showActionsheet && comments === null) {
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
      }
    };
    fetchComments();
  }, [showActionsheet, comments, item.post_id]);

  useEffect(() => {
    const fetchOwner = async () => {
      if (owner === null) {
        try {
          const userService = new UserService();
          const ownerData = await userService.getOne<User>(item.user_id);
          setOwner(ownerData);
        } catch (error) {
          console.error("Error fetching owner:", error);
        }
      }
    };
    fetchOwner();
  }, [owner, item.user_id]);

  return (
    <>
      <TouchableWithoutFeedback
        onPress={handleTap}
        style={Platform.select({
          android: { elevation: 1 },
          web: { cursor: "pointer" },
          default: {},
        })}>
        <Box
          style={{ width: "100%", height: contentHeight }}
          className="relative">
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            nativeControls={false}
          />

          {!isVideoReady && !playerError && (
            <Center className="absolute inset-0 bg-black/50">
              <Spinner color="white" />
            </Center>
          )}

          {playerError && (
            <Center className="absolute inset-0 bg-black/50">
              <Text className="text-white">Failed to load video</Text>
            </Center>
          )}

          {!isPlaying && isVideoReady && (
            <Center className="absolute left-1/2 top-1/2 -ml-[30px] -mt-[30px] opacity-50">
              <Play
                color="#fff"
                fill="#fff"
                className="border-white/50 bg-white/30 backdrop-blur-lg"
                size={60}
              />
            </Center>
          )}

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

          {/* Action tab */}
          <VStack
            className={clsx("absolute bottom-8 right-4 items-center gap-4", {
              "bottom-24": Platform.OS === "ios",
            })}>
            <Avatar size="md" className="mb-8">
              <AvatarFallbackText>{item.user_id}</AvatarFallbackText>
              <AvatarImage
                source={
                  owner?.avatar_url
                    ? { uri: owner?.avatar_url }
                    : require("@/assets/images/avatar.jpg")
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
                  {formatNumber(item.like_total || 0)}
                </Text>
              </VStack>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => setShowActionsheet(true)}>
              <VStack style={{ alignItems: "center" }}>
                <MessageCircle fill="white" color="white" size={35} />
              </VStack>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
              <VStack style={{ alignItems: "center" }}>
                <Bookmark fill="white" color="white" size={35} />
                <Text className="text-white">{formatNumber(0)}</Text>
              </VStack>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
              <VStack style={{ alignItems: "center" }}>
                <Share2 fill="white" color="white" size={35} />
                <Text className="text-white">{formatNumber(0)}</Text>
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
        onClose={() => setShowActionsheet(false)}
        snapPoints={[60]}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetItemText className="text-lg font-semibold">
              {formatNumber(comments?.length || 0)} Bình luận
            </ActionsheetItemText>
          </ActionsheetDragIndicatorWrapper>
          {commentLoading ? (
            <Center>
              <Spinner />
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
    prevProps.item.post_id === nextProps.item.post_id &&
    prevProps.item.video === nextProps.item.video &&
    prevProps.onClosed === nextProps.onClosed
  );
});
