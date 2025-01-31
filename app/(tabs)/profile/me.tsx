import { useState, useEffect, useCallback } from "react";
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
  Heart,
  Lock,
  Music,
  ShoppingBasket,
  UserRoundPlus,
} from "lucide-react-native";
import { Text, TouchableHighlight, TouchableOpacity } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Constants from "expo-constants";
import PostService from "@/services/PostService";
import { Spinner } from "@/components/ui/spinner";
import { Modal, ModalBody, ModalContent } from "@/components/ui/modal";
import VideoItem from "@/components/VideoItem";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signOut } from "@/store/authSlice";
import { useFocusEffect, useRouter } from "expo-router";
import { clsx } from "clsx";
import supabase from "@/configs/supabase/supabase";
import PostItem from "@/components/PostItem";

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
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "private" | "liked">(
    "all",
  );
  const [privatePosts, setPrivatePosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [privatePage, setPrivatePage] = useState(0);
  const [likedPage, setLikedPage] = useState(0);
  const [hasMorePrivate, setHasMorePrivate] = useState(true);
  const [hasMoreLiked, setHasMoreLiked] = useState(true);
  const [loadingMorePrivate, setLoadingMorePrivate] = useState(false);
  const [loadingMoreLiked, setLoadingMoreLiked] = useState(false);

  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      const postService = new PostService();
      if (auth.appUser) {
        const initialPosts = await postService.getPostsByUser(
          0,
          pageSize,
          auth.appUser,
          false,
        );
        setPosts(initialPosts as Post[]);
      }
      setLoading(false);
      setPage(1);
    };

    loadInitialPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("Auth user:", auth.user);
      if (!auth.user) {
        router.push({
          pathname: "/(auth)/login",
        });
      }
    }, [auth.user]),
  );

  const loadMorePosts = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const postService = new PostService();
    const newPosts = auth.appUser
      ? ((await postService.getPostsByUser(
          page,
          pageSize,
          auth.appUser,
          false,
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

    if (isCloseToBottom) {
      switch (activeTab) {
        case "all":
          if (!loadingMore) loadMorePosts();
          break;
        case "private":
          if (!loadingMorePrivate) loadMorePrivatePosts();
          break;
        case "liked":
          if (!loadingMoreLiked) loadMoreLikedPosts();
          break;
      }
    }
  };

  const handlePostPress = (post: Post) => {
    setPreviewVideo({ show: true, item: post });
  };

  const handleLogout = async () => {
    await dispatch(signOut());
  };

  const loadPrivatePosts = async (isInitial = true) => {
    if (isInitial) {
      setLoading(true);
      setPrivatePage(0);
      setHasMorePrivate(true);
    }
    const postService = new PostService();
    if (auth.appUser) {
      const currentPage = isInitial ? 0 : privatePage;
      const privatePostsData = await postService.getPostsByUser(
        currentPage,
        pageSize,
        auth.appUser,
        true,
      );

      if (privatePostsData.length < pageSize) {
        setHasMorePrivate(false);
      }
      if (privatePostsData.length > 0) {
        setPrivatePosts((prev: Post[]) =>
          isInitial
            ? (privatePostsData as Post[])
            : [...prev, ...(privatePostsData as Post[])],
        );
        if (!isInitial) {
          setPrivatePage(currentPage + 1);
        }
      }
    }
    setLoading(false);
  };

  const loadLikedPosts = async (isInitial = true) => {
    if (isInitial) {
      setLoading(true);
      setLikedPage(0);
      setHasMoreLiked(true);
    }
    if (auth.appUser) {
      const { data: likedPostsData } = await supabase
        .from("likes")
        .select(`posts (*)`)
        .eq("user_id", auth.appUser.user_id)
        .range(
          isInitial ? 0 : (likedPage + 1) * pageSize,
          isInitial ? pageSize - 1 : (likedPage + 2) * pageSize - 1,
        );

      if (likedPostsData) {
        const posts = likedPostsData.map((item) => item.posts) as Post[];
        if (posts.length < pageSize) {
          setHasMoreLiked(false);
        }
        if (posts.length > 0) {
          setLikedPosts((prev) => (isInitial ? posts : [...prev, ...posts]));
          if (!isInitial) {
            setLikedPage((prev) => prev + 1);
          }
        }
      }
    }
    setLoading(false);
  };

  const loadMorePrivatePosts = async () => {
    if (loadingMorePrivate || !hasMorePrivate) return;
    setLoadingMorePrivate(true);
    await loadPrivatePosts(false);
    setLoadingMorePrivate(false);
  };

  const loadMoreLikedPosts = async () => {
    if (loadingMoreLiked || !hasMoreLiked) return;
    setLoadingMoreLiked(true);
    await loadLikedPosts(false);
    setLoadingMoreLiked(false);
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleShareProfile = () => {
    router.push({
      pathname: "/(tabs)/profile/share",
      params: {
        id: auth.appUser?.user_id,
      },
    });
  };

  const handleCloseModal = () => {
    setPreviewVideo({ show: false, item: null });
  };

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
            <TouchableHighlight>
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
              <Button variant="outline" onPress={handleEditProfile}>
                <ButtonText>Sửa hồ sơ</ButtonText>
              </Button>
              <Button variant="outline" onPress={handleShareProfile}>
                <ButtonText>Chia sẻ hồ sơ</ButtonText>
              </Button>
              <Button variant="outline">
                <ButtonText>
                  <UserRoundPlus size={16} color="#D91656" />
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
          </VStack>

          <HStack className="justify-around">
            <Pressable
              className={clsx(
                "flex-1 py-2",
                activeTab === "all" && "border-b-2 border-b-black",
              )}
              onPress={() => setActiveTab("all")}>
              <Center>
                <Grid size={16} color="#D91656" />
              </Center>
            </Pressable>
            <Pressable
              className={clsx(
                "flex-1 py-2",
                activeTab === "private" && "border-b-2 border-b-black",
              )}
              onPress={() => {
                setActiveTab("private");
                loadPrivatePosts();
              }}>
              <Center>
                <Lock size={16} color="#D91656" />
              </Center>
            </Pressable>
            <Pressable
              className={clsx(
                "flex-1 py-2",
                activeTab === "liked" && "border-b-2 border-b-black",
              )}
              onPress={() => {
                setActiveTab("liked");
                loadLikedPosts();
              }}>
              <Center>
                <Heart size={16} color="#D91656" />
              </Center>
            </Pressable>
          </HStack>

          <Box className="flex-row flex-wrap">
            {loading ? (
              <Center className="flex-1">
                <Spinner size="small" className="text-slate-500" />
              </Center>
            ) : (
              <>
                {activeTab === "all" && (
                  <>
                    {posts.map((post, index) => (
                      <PostItem
                        key={index}
                        post={post}
                        onPress={() => handlePostPress(post)}
                      />
                    ))}
                    {loadingMore && (
                      <Center className="w-full py-4">
                        <Spinner size="small" className="text-slate-500" />
                      </Center>
                    )}
                  </>
                )}
                {activeTab === "private" && (
                  <>
                    {privatePosts.map((post, index) => (
                      <PostItem
                        key={index}
                        post={post}
                        onPress={() => handlePostPress(post)}
                      />
                    ))}
                    {loadingMorePrivate && (
                      <Center className="w-full py-4">
                        <Spinner size="small" className="text-slate-500" />
                      </Center>
                    )}
                  </>
                )}
                {activeTab === "liked" && (
                  <>
                    {likedPosts.map((post, index) => (
                      <PostItem
                        key={index}
                        post={post}
                        onPress={() => handlePostPress(post)}
                      />
                    ))}
                    {loadingMoreLiked && (
                      <Center className="w-full py-4">
                        <Spinner size="small" className="text-slate-500" />
                      </Center>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </VStack>

        {/* Video Preview Modal */}
        {previewVideo.show && previewVideo.item && (
          <Modal
            size="full"
            isOpen={previewVideo.show}
            onClose={handleCloseModal}>
            <ModalContent className="bg-black p-0">
              <ModalBody className="p-0">
                <VideoItem
                  item={previewVideo.item}
                  isActive={true}
                  onClosed={handleCloseModal}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}
