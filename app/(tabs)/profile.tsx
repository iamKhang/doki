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
import {
  Text,
  Touchable,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Constants from "expo-constants";
import PostService from "@/services/PostService";
import { Spinner } from "@/components/ui/spinner";
import { Modal, ModalBody, ModalContent } from "@/components/ui/modal";
import VideoItem from "@/components/VideoItem";
import AuthModal from "@/components/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signOut } from "@/store/authSlice";
import { Redirect } from "expo-router";

export default function ProfilePage() {
  const auth = useSelector((state: RootState) => state.auth);
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      const postService = new PostService();
      if (auth.appUser) {
        const initialPosts = await postService.getPostsByUser(
          0,
          pageSize,
          auth.appUser,
        );
        setPosts(initialPosts as Post[]);
      }
      setLoading(false);
      setPage(1);
    };

    loadInitialPosts();
  }, []);

  const loadMorePosts = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const postService = new PostService();
    const newPosts = auth.appUser
      ? ((await postService.getPostsByUser(
          page,
          pageSize,
          auth.appUser,
        )) as Post[])
      : [];

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

  const handleLogout = async () => {
    await dispatch(signOut());
  };

  useEffect(() => {
    setAuthModalOpen(!auth.user);
    console.log(auth.appUser);
  }, [auth.user]);

  if (!auth.user) {
    return <Redirect href="/auth/auth" />;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <ScrollView
        style={{ marginTop: Constants.statusBarHeight }}
        onScroll={handleScroll}
        scrollEventThrottle={400}>
        <VStack space="md" className="pb-20">
          <HStack className="items-center justify-center px-4 py-2">
            <Text className="text-lg font-bold">
              {auth.appUser?.first_name} {auth.appUser?.last_name}
            </Text>
          </HStack>

          <VStack space="sm" className="items-center">
            <TouchableHighlight onPress={() => setAuthModalOpen(true)}>
              <Avatar size="xl">
                <AvatarFallbackText></AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: auth.appUser?.avatar_url,
                  }}
                  alt="avatar"
                />
              </Avatar>
            </TouchableHighlight>
            <Text>{auth.appUser?.username}</Text>
            <HStack space="xl" className="justify-center">
              <VStack className="items-center">
                <Text className="font-bold">{auth.appUser?.follow_total}</Text>
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
            <HStack className="gap-2">
              <Button variant="outline" size="sm">
                <ButtonText>+ Thêm tiểu sử</ButtonText>
              </Button>

              <Button variant="outline" size="sm" onPress={handleLogout}>
                <ButtonText>Đăng xuất </ButtonText>
              </Button>
            </HStack>
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
    </GestureHandlerRootView>
  );
}
