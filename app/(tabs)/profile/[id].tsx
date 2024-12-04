import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Grid, Heart, Lock, Share2 } from "lucide-react-native";
import Constants from "expo-constants";
import UserService from "@/services/UserService";
import PostService from "@/services/PostService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Center } from "@/components/ui/center";
import { Pressable } from "@/components/ui/pressable";
import { clsx } from "clsx";
import { Spinner } from "@/components/ui/spinner";
import PostItem from "@/components/PostItem";
import { Modal, ModalBody, ModalContent } from "@/components/ui/modal";
import VideoItem from "@/components/VideoItem";
import supabase from "@/configs/supabase/supabase";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const currentUser = useSelector((state: RootState) => state.auth.appUser);
  const [userData, setUserData] = useState<User | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "liked">("all");
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [previewVideo, setPreviewVideo] = useState<{
    show: boolean;
    item: Post | null;
  }>({ show: false, item: null });

  useEffect(() => {
    console.log("Component mounted, id:", id);
    loadUserData();
  }, [id]);

  useEffect(() => {
    console.log("Avatar URL:", userData?.avatar_url);
  }, [userData?.avatar_url]);

  const loadUserData = async () => {
    try {
      console.log("Starting to load user data...");
      setLoading(true);
      const userService = new UserService();
      const postService = new PostService();

      const userData = (await userService.getOne(id as string)) as User;
      console.log("Loaded user data:", userData);
      console.log("Avatar URL:", userData?.avatar_url);

      const followerCount = await userService.getFollowerCount(id as string);
      const userPosts = await postService.getPostsByUser(
        0,
        9,
        userData as User,
      );

      if (currentUser) {
        const following = await userService.isFollowing(
          currentUser.user_id,
          id as string,
        );
        setIsFollowing(following);
      }

      setUserData(userData as User);
      setFollowerCount(followerCount);
      setPosts(userPosts as Post[]);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    console.log(userData?.avatar_url);
    if (!currentUser || !userData) return;

    const userService = new UserService();
    console.log(userData.avatar_url);
    try {
      if (isFollowing) {
        await userService.unfollowUser(currentUser.user_id, id as string);
      } else {
        await userService.followUser(currentUser.user_id, id as string);
      }
      setIsFollowing(!isFollowing);
      setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostPress = (post: Post) => {
    setPreviewVideo({ show: true, item: post });
  };

  const handleShare = async () => {
    router.push({
      pathname: "/profile/share-profile",
      params: {
        id: id,
      },
    });
  };

  return (
    <Box
      className="flex-1 bg-white"
      style={{ paddingTop: Constants.statusBarHeight }}>
      <HStack className="items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold">
          {userData?.first_name + " " + userData?.last_name}
        </Text>

        <TouchableOpacity onPress={handleShare}>
          <Share2 size={24} color="black" />
        </TouchableOpacity>
      </HStack>

      <ScrollView>
        <VStack space="md" className="pb-20">
          <VStack space="sm" className="items-center">
            <Avatar size="xl">
              <AvatarFallbackText>
                {userData?.username?.[0]?.toUpperCase() || ""}
              </AvatarFallbackText>
              {imageLoading && (
                <Center className="absolute h-full w-full bg-gray-100">
                  <Spinner size="small" />
                </Center>
              )}
              {userData?.avatar_url && (
                <AvatarImage
                  source={{
                    uri: userData.avatar_url,
                    cache: "reload",
                  }}
                  alt="avatar"
                  onLoadStart={() => {
                    console.log("Starting to load avatar image...");
                    setImageLoading(true);
                  }}
                  onLoadEnd={() => {
                    console.log("Avatar image load completed");
                    setImageLoading(false);
                  }}
                  onError={(e) => {
                    console.log("Avatar load error:", e.nativeEvent.error);
                    console.log("Attempted URL:", userData.avatar_url);
                    setImageLoading(false);
                  }}
                />
              )}
            </Avatar>
            <Text>{userData?.username}</Text>
            <HStack space="xl" className="justify-center">
              <VStack className="items-center">
                <Text className="font-bold">{userData?.follow_total || 0}</Text>
                <Text className="text-xs">Đang follow</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="font-bold">{followerCount}</Text>
                <Text className="text-xs">Follower</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="font-bold">{posts.length}</Text>
                <Text className="text-xs">Video</Text>
              </VStack>
            </HStack>

            {currentUser && currentUser.user_id !== id && (
              <Button
                variant={isFollowing ? "outline" : "solid"}
                onPress={handleFollow}
                className="bg-[#D91656]">
                <ButtonText className="text-white">
                  {isFollowing ? "Đang Follow" : "Follow"}
                </ButtonText>
              </Button>
            )}
          </VStack>

          <Box className="flex-row flex-wrap">
            {loading ? (
              <Center className="flex-1">
                <Spinner size="small" className="text-slate-500" />
              </Center>
            ) : (
              posts.map((post, index) => (
                <PostItem
                  key={index}
                  post={post}
                  onPress={() => handlePostPress(post)}
                />
              ))
            )}
          </Box>
        </VStack>

        {previewVideo.show && previewVideo.item && (
          <Modal
            size="full"
            isOpen={previewVideo.show}
            onClose={() => setPreviewVideo({ show: false, item: null })}>
            <ModalContent className="bg-black p-0">
              <ModalBody className="p-0">
                <VideoItem
                  item={previewVideo.item}
                  isActive={true}
                  onClosed={() =>
                    setPreviewVideo((prev) => ({ ...prev, show: false }))
                  }
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </ScrollView>
    </Box>
  );
}
