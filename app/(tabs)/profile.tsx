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
import { Text } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Constants from "expo-constants";
import PostService from "@/services/PostService";
import { Spinner } from "@/components/ui/spinner";
import { Modal, ModalBody, ModalContent } from "@/components/ui/modal";
import VideoItem from "@/components/VideoItem"; // Ensure VideoItem is properly imported

export default function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<{
    show: boolean;
    item: Post | null;
  }>({
    show: false,
    item: null,
  });
  const pageSize = 9;

  // Load initial posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      const postService = new PostService();
      const initialPosts = await postService.getPostsByPage(0, pageSize);
      setPosts(initialPosts as Post[]);
      setLoading(false);
      setPage(1);
    };

    loadInitialPosts();
  }, []);

  const loadMorePosts = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const postService = new PostService();
    const newPosts = (await postService.getPostsByPage(
      page,
      pageSize,
    )) as Post[];

    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage(page + 1);
    }

    setLoadingMore(false);
  };

  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;

    if (isCloseToBottom && !loadingMore) {
      loadMorePosts();
    }
  };

  const handlePostPress = (post: Post) => {
    setPreviewVideo({ show: true, item: post });
  };

  return (
    <GestureHandlerRootView>
      <ScrollView
        style={{ marginTop: Constants.statusBarHeight }}
        onScroll={handleScroll}
        scrollEventThrottle={400}>
        <VStack space="md" className="pb-20">
          {/* Profile details and buttons */}
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
              posts.map((post, index) => (
                <Pressable
                  key={index}
                  className="aspect-square w-1/3 p-1"
                  onPress={() => handlePostPress(post)}>
                  {post.thumbnail_url ? (
                    <Image
                      source={{ uri: post.thumbnail_url }}
                      alt="thumbnail"
                      className="h-full w-full rounded-lg"
                    />
                  ) : (
                    <Text>Failed to load thumbnail</Text>
                  )}
                  <Text className="absolute bottom-3 left-2 rounded-s p-1 text-xs color-white">
                    {post.like_total} Likes
                  </Text>
                </Pressable>
              ))
            )}
          </Box>
          {loadingMore && (
            <Center className="py-4">
              <Spinner size="small" className="text-slate-500" />
            </Center>
          )}
        </VStack>

        {/* Video Preview Modal */}
        {previewVideo.show && previewVideo.item && (
          <Modal
            size="full"
            isOpen={previewVideo.show}
            onClose={() => setPreviewVideo({ show: false, item: null })}>
            <ModalContent className="bg-black p-0">
              <ModalBody className="p-0">
                <VideoItem item={previewVideo.item} isActive={true} />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}
