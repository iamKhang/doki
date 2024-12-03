import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { Platform } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Bookmark } from "lucide-react-native";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { formatNumber } from "@/utils/Format";
import clsx from "clsx";
import Chat from "./svgs/chat.svg";
import Heart from "./svgs/heart.svg";
import ReadHeart from "./svgs/red-heart.svg";
import Share from "./svgs/share.svg";
import LikeService from "@/services/LikeService";
import { useAppSelector } from "@/store/hooks";

interface ActionTabProps {
  owner: User | null;
  postId: string;
  hearted: boolean;
  setHearted: (value: boolean) => void;
  likeTotal: number;
  setLikeTotal: React.Dispatch<React.SetStateAction<number>>;
  onCommentPress: () => void;
}

const ActionTab = ({
  owner,
  postId,
  hearted,
  setHearted,
  likeTotal,
  setLikeTotal,
  onCommentPress,
}: ActionTabProps) => {
  const auth = useAppSelector((state) => state.auth);
  const likeService = new LikeService();
  const user = auth.user;

  const handleLikePress = async () => {
    if (!user) return;

    try {
      const isNowLiked = await likeService.toggleLike(postId, user.id);
      setHearted(isNowLiked);
      setLikeTotal((prev: number) => (isNowLiked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
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

      <TouchableWithoutFeedback onPress={handleLikePress}>
        <VStack style={{ alignItems: "center" }}>
          {hearted ? (
            <ReadHeart width={35} height={35} />
          ) : (
            <Heart width={35} height={35} />
          )}
          <Text className="text-white">{formatNumber(likeTotal)}</Text>
        </VStack>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={onCommentPress}>
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
  );
};

export default ActionTab;
