import React, { useEffect, useState } from "react";
import {
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Box } from "@/components/ui/box";
import { Bookmark, Play, Send, Share2, X } from "lucide-react-native";
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
import Chat from "./svgs/chat.svg";
import Heart from "./svgs/heart.svg";
import ReadHeart from "./svgs/red-heart.svg";
import Share from "./svgs/share.svg";
import { isLoaded } from "expo-font";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
  const [commentInput, setCommentInput] = useState<string>("");

  const auth = useSelector((state: RootState) => state.auth);
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

  const handleTap = () => {
    if (player.playing) player.pause();
    else player.play();
  };

  useEffect(() => {
    if (!player || !readyToPlay) return;
    const handlePlayback = async () => {
      if (isActive && !player.playing) {
        player.play();
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

  const handleComment = async () => {
    if (!item.post_id || !auth.user?.id) return null;
    const commentS = new CommentService();
    const newComment: Partial<PostComment> = {
      post_id: item.post_id,
      user_id: auth.user.id,
      content: commentInput,
      created_at: new Date().toLocaleDateString(),
      updated_at: new Date().toLocaleDateString(),
    };
    const createdComment = (await commentS.create(
      newComment,
    )) as ExtendedComment;
    setComments((prev): ExtendedComment[] =>
      prev !== null ? [createdComment, ...prev] : [createdComment],
    );
    setCommentInput("");
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={handleTap}>
        <Box
          style={{ width: "100%", height: contentHeight }}
          className="relative">
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            nativeControls={false}
          />

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

          {!isPlaying && (
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
              <AvatarFallbackText>
                {(owner?.first_name?.[0] || "") + (owner?.last_name?.[0] || "")}
              </AvatarFallbackText>
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
                {hearted ? (
                  <Heart width={35} height={35} />
                ) : (
                  <ReadHeart width={35} height={35} />
                )}
                <Text className="text-white">
                  {formatNumber(item.like_total || 0)}
                </Text>
              </VStack>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => setShowActionsheet(true)}>
              <VStack style={{ alignItems: "center" }}>
                <Chat width={32} height={32} />
              </VStack>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
              <VStack style={{ alignItems: "center" }}>
                <Bookmark fill="white" color="white" size={30} />
              </VStack>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
              <VStack style={{ alignItems: "center" }}>
                <Share width={32} height={32} />
              </VStack>
            </TouchableWithoutFeedback>
          </VStack>

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
      </TouchableWithoutFeedback>

      {/* Actionsheet */}
      <Actionsheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
        snapPoints={[60]}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="px-0">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetItemText className="text-lg font-semibold">
              {formatNumber(comments?.length || 0)} Bình luận
            </ActionsheetItemText>
          </ActionsheetDragIndicatorWrapper>
          {commentLoading ? (
            <Center className="flex-1">
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
          {auth.appUser && (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <HStack className="h-[85px] w-full border-t-[1px] border-gray-100 px-4 py-2 pb-4">
                <Avatar size="md">
                  <AvatarFallbackText>
                    {(auth.appUser.first_name?.[0] || "") +
                      (auth.appUser.last_name?.[0] || "")}
                  </AvatarFallbackText>
                  <AvatarImage
                    source={
                      auth.appUser.avatar_url
                        ? { uri: auth.appUser.avatar_url }
                        : require("@/assets/images/avatar.jpg")
                    }
                  />
                  <AvatarBadge />
                </Avatar>

                <Input isFullWidth className="ml-4 flex-1 rounded-full">
                  <InputField
                    value={commentInput}
                    onChangeText={(text) => setCommentInput(text)}
                    placeholder="Enter your comment"
                    className="w-full p-0 px-4"
                  />
                </Input>
                <TouchableWithoutFeedback
                  onPress={handleComment}
                  disabled={commentInput === ""}>
                  <Center className="ml-2 h-[35px] w-[35px] rounded-full bg-red-500 p-1">
                    <Send size={20} color="white" />
                  </Center>
                </TouchableWithoutFeedback>
              </HStack>
            </KeyboardAvoidingView>
          )}
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
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
