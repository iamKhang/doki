import React, { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Send, Sparkle } from "lucide-react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import CommentItem from "@/components/CommentItem";
import CommentService, { ExtendedComment } from "@/services/CommentService";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { formatNumber } from "@/utils/Format";
import { generateResponse } from "@/services/AIService";
import { Text } from "@/components/ui/text";

interface CommentActionsheetProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  comments: ExtendedComment[] | null;
  setComments: React.Dispatch<React.SetStateAction<ExtendedComment[] | null>>;
  commentLoading: boolean;
  auth: any;
  item: Post;
}

const CommentActionsheet = ({
  isOpen,
  onClose,
  postId,
  comments,
  setComments,
  commentLoading,
  auth,
  item,
}: CommentActionsheetProps) => {
  const [commentInput, setCommentInput] = useState<string>("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleComment = async () => {
    if (!postId || !auth.user?.id) return null;
    const commentS = new CommentService();
    const newComment: Partial<PostComment> = {
      post_id: postId,
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

  const handleAIComment = async () => {
    try {
      setCommentInput("");
      setErrorMessage(null);
      setIsGeneratingAI(true);
      const response = await generateResponse(
        "generate a random comment, do not say hello again. The video content is: " +
          item.title,
      );
      if (response) {
        console.log(response);
        setCommentInput(response?.text || "");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error("Failed to generate AI comment:", error.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[60]}>
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
          <HStack
            className="h-[85px] w-full border-t-[1px] border-gray-100 px-4 py-2"
            style={{
              position: "absolute",
              bottom: keyboardHeight + 16,
              backgroundColor: "white",
              left: 0,
              right: 0,
            }}>
            <Avatar size="sm" className="h-[35px] w-[35px]">
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

            <Input
              isFullWidth
              className="ml-4 flex-1 rounded-full"
              isDisabled={isGeneratingAI}>
              <InputField
                value={commentInput}
                onChangeText={(text) => setCommentInput(text)}
                placeholder="Enter your comment"
                className="w-full p-0 px-4"
              />
            </Input>

            <TouchableWithoutFeedback
              onPress={handleAIComment}
              disabled={isGeneratingAI}>
              <Center className="ml-2 h-[35px] w-[35px] rounded-full bg-blue-500 p-1">
                {isGeneratingAI ? (
                  <Spinner color="white" size="small" />
                ) : (
                  <Sparkle
                    size={20}
                    color="white"
                    className="-translate-x-0.5"
                  />
                )}
              </Center>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={handleComment}
              disabled={commentInput === ""}>
              <Center className="ml-2 h-[35px] w-[35px] rounded-full bg-red-500 p-1">
                <Send size={20} color="white" className="-translate-x-0.5" />
              </Center>
            </TouchableWithoutFeedback>
          </HStack>
        )}
        {errorMessage && (
          <Text className="mb-2 text-center text-sm text-red-500">
            {errorMessage}
          </Text>
        )}
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default CommentActionsheet;
