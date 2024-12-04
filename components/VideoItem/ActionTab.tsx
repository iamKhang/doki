import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { Platform } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
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
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";

interface ActionTabProps {
  owner: User | null;
  postId: string;
  hearted: boolean;
  setHearted: (value: boolean) => void;
  likeTotal: number;
  setLikeTotal: React.Dispatch<React.SetStateAction<number>>;
  onCommentPress: () => void;
  videoUrl: string;
  onToggleLike: () => void;
}

const ActionTab = ({
  owner,
  postId,
  hearted,
  setHearted,
  likeTotal,
  setLikeTotal,
  onCommentPress,
  videoUrl,
  onToggleLike,
}: ActionTabProps) => {
  const auth = useAppSelector((state) => state.auth);
  const likeService = new LikeService();
  const user = auth.user;

  const handleProfilePress = () => {
    router.push(`/profile/${owner?.user_id}`);
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable && videoUrl) {
        // Show some loading state if needed

        // Generate a temporary file path
        const fileExt = videoUrl.split(".").pop() || "mp4";
        const localUri = `${FileSystem.cacheDirectory}temp_video.${fileExt}`;

        // Download the file
        const downloadResumable = FileSystem.createDownloadResumable(
          videoUrl,
          localUri,
          {},
          (downloadProgress) => {
            const progress =
              downloadProgress.totalBytesWritten /
              downloadProgress.totalBytesExpectedToWrite;
            // You can use this progress value to show a progress indicator if needed
          },
        );

        const result = await downloadResumable.downloadAsync();
        if (!result) throw new Error("Download failed");

        // Share the local file
        await Sharing.shareAsync(result.uri, {
          dialogTitle: "Share this video",
          mimeType: "video/mp4",
          UTI: "public.movie",
        });

        // Clean up
        await FileSystem.deleteAsync(result.uri, { idempotent: true });
      } else {
        console.log("Sharing is not available on this platform");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <VStack
      className={clsx("absolute bottom-12 right-4 z-30 items-center gap-4", {
        "bottom-24": Platform.OS === "ios",
      })}>
      <TouchableWithoutFeedback onPress={handleProfilePress}>
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
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={onToggleLike}>
        <VStack style={{ alignItems: "center" }}>
          {hearted ? (
            <ReadHeart width={35} height={35} />
          ) : (
            <Heart width={35} height={35} />
          )}
          <Text className="text-xs text-white">{formatNumber(likeTotal)}</Text>
        </VStack>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={onCommentPress}>
        <VStack style={{ alignItems: "center" }}>
          <Chat width={32} height={32} />
        </VStack>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={handleShare}>
        <VStack style={{ alignItems: "center" }}>
          <Share width={32} height={32} />
        </VStack>
      </TouchableWithoutFeedback>
    </VStack>
  );
};

export default ActionTab;
