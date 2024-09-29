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

export default function ProfilePage() {
  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
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
            {[...Array(6)].map((_, index) => (
              <Box key={index} className="aspect-square w-1/3 p-1">
                <Image
                  source={{
                    uri: `https://example.com/video-thumbnail-${index + 1}.jpg`,
                  }}
                  style={styles.thumbnail}
                />
                <Text style={styles.viewCount}>229 N</Text>
              </Box>
            ))}
          </Box>
        </VStack>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "$white",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  viewCount: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
  },
});
