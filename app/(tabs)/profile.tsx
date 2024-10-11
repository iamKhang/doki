import { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import {
  BookMarked,
  Grid,
  Headphones,
  Heart,
  Lock,
  Menu,
  Music,
  ShoppingBasket,
  UserRoundPlus,
} from "lucide-react-native";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Constants from "expo-constants";
import * as VideoThumbnails from "expo-video-thumbnails";
import PostService from "@/services/PostService";
import { Spinner } from "@/components/ui/spinner";

export default function ProfilePage() {
  const [thumbnails, setThumbnails] = useState<(string | null)[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 9;

  // Load initial posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      const postService = new PostService();
      const initialPosts = await postService.getPostsByPage(0, pageSize);
      setPosts(initialPosts);
      setLoading(false);
      setPage(1);
    };

    loadInitialPosts();
  }, []);

  const loadMorePosts = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const postService = new PostService();
    const newPosts = await postService.getPostsByPage(page, pageSize);

    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage(page + 1);
    }

    setLoadingMore(false);
  };

  useEffect(() => {
    const generateThumbnails = async () => {
      const newThumbnails = await Promise.all(
        posts.map(async (post) => {
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
              post.video,
              {
                time: 3000,
              },
            );
            return uri;
          } catch (e) {
            console.warn(e);
            return null;
          }
        }),
      );
      setThumbnails(newThumbnails);
    };

    generateThumbnails();
  }, [posts]);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;

    if (isCloseToBottom && !loadingMore) {
      loadMorePosts();
    }
  };

  return (
    <GestureHandlerRootView>
      <ScrollView
        style={{ marginTop: Constants.statusBarHeight }}
        onScroll={handleScroll}
        scrollEventThrottle={400}>
        <VStack space="md" className="pb-20">
          <HStack className="items-center justify-center px-4 py-2">
            <Text className="text-lg font-bold">Người Việt gốc WestS...</Text>
            <HStack space="sm">
              <Headphones size={16} />
              <Menu size={16} />
            </HStack>
          </HStack>

          <VStack space="sm" className="items-center">
            <Avatar size="xl">
              <AvatarFallbackText></AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: "https://img.hoidap247.com/picture/question/20200508/large_1588936738888.jpg?v=0",
                }}
                alt="avatar"
              />
            </Avatar>
            <Text>@_iamquanzkhang</Text>
            <HStack space="xl" className="justify-center">
              <VStack className="items-center">
                <Text className="font-bold">240</Text>
                <Text className="text-xs">Đã follow</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="font-bold">12</Text>
                <Text className="text-xs">Follower</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="font-bold">0</Text>
                <Text className="text-xs">Thích</Text>
              </VStack>
            </HStack>
            <HStack space="sm">
              <Button variant="outline">
                <ButtonText>Sửa hồ sơ</ButtonText>
              </Button>
              <Button variant="outline">
                <ButtonText>Chia sẻ hồ sơ </ButtonText>
              </Button>
              <Button variant="outline">
                <ButtonText>
                  <UserRoundPlus size={16} />
                </ButtonText>
              </Button>
            </HStack>
            <Button variant="outline" size="sm">
              <ButtonText>+ Thêm tiểu sử</ButtonText>
            </Button>
            <HStack space="md">
              <HStack space="xs" className="items-center">
                <Music size={16} />
                <Text>TikTok Studio</Text>
              </HStack>
              <HStack space="xs" className="items-center">
                <ShoppingBasket size={16} />
                <Text>Đơn hàng của bạn</Text>
              </HStack>
            </HStack>
          </VStack>

          <HStack className="justify-around">
            <Pressable className="flex-1 border-b-2 border-b-black py-2">
              <Center>
                <Grid size={16} />
              </Center>
            </Pressable>
            <Pressable className="flex-1 py-2">
              <Center>
                <Lock size={16} />
              </Center>
            </Pressable>
            <Pressable className="flex-1 py-2">
              <Center>
                <BookMarked size={16} />
              </Center>
            </Pressable>
            <Pressable className="flex-1 py-2">
              <Center>
                <Heart size={16} />
              </Center>
            </Pressable>
          </HStack>

          <Box className="flex-row flex-wrap">
            {loading ? (
              <Center className="flex-1">
                <Spinner size="small" className="text-slate-500" />
              </Center>
            ) : (
              thumbnails.map((thumbnail, index) => (
                <Box key={index} className="aspect-square w-1/3 p-1">
                  {thumbnail ? (
                    <Image
                      source={{ uri: thumbnail }}
                      alt="thumbnail"
                      className="h-full w-full rounded-lg"
                    />
                  ) : (
                    <Text>Failed to load thumbnail</Text>
                  )}
                  <Text className="absolute bottom-3 left-2 rounded-s p-1 text-xs color-white">
                    {posts[index]?.like_total} Likes
                  </Text>
                </Box>
              ))
            )}
          </Box>
          {loadingMore && (
            <Center className="py-4">
              <Spinner size="small" className="text-slate-500" />
            </Center>
          )}
        </VStack>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
