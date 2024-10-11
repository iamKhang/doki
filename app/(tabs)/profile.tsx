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
  Feather,
  FeatherIcon,
  Grid,
  Headphones,
  Heart,
  Icon,
  Lock,
  Menu,
  Music,
  ShoppingBasket,
  UserRoundPlus,
} from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Constants from "expo-constants";
import * as VideoThumbnails from "expo-video-thumbnails";

const videoUrls = [
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/5890417728103.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/5890417728103.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/5890417728103.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/5890417728103.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/5890417728103.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/5890417728103.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
  "https://exthbgzjojqiyppnqllw.supabase.co/storage/v1/object/public/STATIC_BUCKET/videos/Snaptik.app_7383619235999714578.mp4",
];

export default function ProfilePage() {
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    const generateThumbnails = async () => {
      const thumbnailUris = await Promise.all(
        videoUrls.map(async (videoUrl) => {
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
              time: 3000,
            });
            return uri;
          } catch (e) {
            console.warn(e);
            return null;
          }
        }),
      );
      setThumbnails(thumbnailUris);
    };

    generateThumbnails();
  }, []);

  return (
    <GestureHandlerRootView>
      <ScrollView style={{ marginTop: Constants.statusBarHeight }}>
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
            {thumbnails.map((thumbnail, index) => (
              <Box key={index} className="aspect-square w-1/3 p-1">
                {thumbnail ? (
                  <Image
                    source={{ uri: thumbnail }}
                    // style={styles.thumbnail}
                    alt="thumbnail"
                    className="h-full w-full rounded-lg"
                  />
                ) : (
                  <Text>Failed to load thumbnail</Text>
                )}
                <Text className="absolute bottom-3 left-2 rounded-s p-1 text-xs color-white">
                  229 N
                </Text>
              </Box>
            ))}
          </Box>
        </VStack>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
