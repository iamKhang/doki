import React, { useEffect, useState, useCallback } from "react";
import {
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  Keyboard,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Box } from "@/components/ui/box";
import { Play, X } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import clsx from "clsx";
import { Center } from "@/components/ui/center";
import { Button } from "../ui/button";
import CommentService, { ExtendedComment } from "@/services/CommentService";
import UserService from "@/services/UserService";
import { HStack } from "../ui/hstack";
import { Spinner } from "../ui/spinner";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useEvent } from "expo";
import { useAppSelector } from "@/store/hooks";
import { memo } from "react";
import CommentActionsheet from "./CommentActionsheet";
import ActionTab from "./ActionTab";
import LikeService from "@/services/LikeService";
import DoubleTapHeart from "./DoubleTapHeart";

const { height } = Dimensions.get("window");

interface VideoItemProps {
  item: Post;
  isActive: boolean;
  onClosed?: () => void;
}

const VideoItem = ({ item, isActive, onClosed }: VideoItemProps) => {
  const [comments, setComments] = useState<ExtendedComment[] | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [hearted, setHearted] = useState(false);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeTotal, setLikeTotal] = useState(item.like_total || 0);
  const [userPaused, setUserPaused] = useState(false);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null);
  const DOUBLE_TAP_DELAY = 300; // milliseconds
  const [showHeart, setShowHeart] = useState(false);

  const auth = useAppSelector((state) => state.auth);
  const tabBarHeight = useTabBarHeight();
  const contentHeight = height - tabBarHeight;
  const player = useVideoPlayer(item.video || null, (player) => {
    player.loop = true;
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });
  const readyToPlay = status === "readyToPlay";
  const error = status === "error";

  const handleTap = React.useCallback(() => {
    if (!player || !readyToPlay) return;

    if (player.playing) {
      player.pause();
      setUserPaused(true);
    } else {
      player.play();
      setUserPaused(false);
    }
  }, [player, readyToPlay]);

  const handleToggleLike = async () => {
    if (!auth.user) return;
    const likeService = new LikeService();
    const isNowLiked = await likeService.toggleLike(item.post_id, auth.user.id);
    setHearted(isNowLiked);
    setLikeTotal((prev: number) => (isNowLiked ? prev + 1 : prev - 1));
  };

  const handlePress = useCallback(() => {
    const now = Date.now();

    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (tapTimeout) {
        clearTimeout(tapTimeout);
        setTapTimeout(null);
      }
      if (!hearted) {
        handleToggleLike();
      }
      setLastTap(null);
      setShowHeart(true);
    } else {
      // Potential single tap
      setLastTap(now);

      // Clear any existing timeout
      if (tapTimeout) {
        clearTimeout(tapTimeout);
      }

      // Set new timeout for single tap
      const timeout = setTimeout(() => {
        handleTap();
        setLastTap(null);
      }, DOUBLE_TAP_DELAY);

      setTapTimeout(timeout);
    }
  }, [lastTap, handleTap, handleToggleLike, player, tapTimeout]);

  useEffect(() => {
    return () => {
      if (tapTimeout) {
        clearTimeout(tapTimeout);
      }
    };
  }, [tapTimeout]);

  useEffect(() => {
    if (!player || !readyToPlay) return;
    const handlePlayback = async () => {
      if (isActive && !player.playing) {
        player.play();
        setUserPaused(false);
      } else {
        player.pause();
      }
    };

    handlePlayback();
  }, [isActive, readyToPlay]);

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

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!auth.user?.id) return;
      try {
        const likeService = new LikeService();
        const isLiked = await likeService.checkIfLiked(
          item.post_id,
          auth.user.id,
        );
        setHearted(isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [item.post_id, auth.user?.id]);

  return (
    <>
      <Box style={{ height: contentHeight }} className="relative w-full">
        <Box style={{ height: "100%", width: "100%" }} className="relative">
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            nativeControls={false}
          />

          <TouchableWithoutFeedback onPress={handlePress}>
            <Box
              className="absolute inset-0 z-10"
              style={{
                backgroundColor: "transparent",
                height: "100%",
                width: "100%",
              }}
            />
          </TouchableWithoutFeedback>

          {!readyToPlay && !error && (
            <Center className="absolute inset-0 bg-black/50">
              <Spinner color="white" />
            </Center>
          )}

          {error && (
            <Center className="absolute inset-0 bg-black/50">
              <Text className="text-white">Failed to load video</Text>
              <Text className="text-red">{error}</Text>
            </Center>
          )}

          {readyToPlay && !isPlaying && userPaused && (
            <Center className="absolute left-1/2 top-1/2 -ml-[30px] -mt-[30px] opacity-50">
              <Play
                color="#fff"
                fill="#fff"
                className="border-white/50 bg-white/30 backdrop-blur-lg"
                size={60}
              />
            </Center>
          )}

          {showHeart && (
            <DoubleTapHeart onAnimationEnd={() => setShowHeart(false)} />
          )}
        </Box>

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

        <ActionTab
          owner={owner}
          postId={item.post_id}
          hearted={hearted}
          setHearted={setHearted}
          likeTotal={likeTotal}
          setLikeTotal={setLikeTotal}
          onCommentPress={() => setShowActionsheet(true)}
          videoUrl={item.video || ""}
          onToggleLike={handleToggleLike}
        />

        {/* Bottom tab */}
        <VStack
          className={clsx("absolute bottom-8 left-0 right-0 px-4 pr-[72px]")}>
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

      <CommentActionsheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
        postId={item.post_id}
        comments={comments}
        setComments={setComments}
        commentLoading={commentLoading}
        auth={auth}
      />
    </>
  );
};

export default memo(VideoItem);
