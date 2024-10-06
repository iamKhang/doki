import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import Constants from "expo-constants";

import {
  Bell,
  Camera,
  ChevronRight,
  Inbox,
  ShoppingBag,
  User,
} from "lucide-react-native";
import { ScrollView } from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const notifications = [
  {
    icon: <User color="#00BFFF" />,
    title: "Những Follower mới",
    description: "Anh thợ tóc CT đã yêu cầu follow bạn.",
    chevron: true,
  },
  {
    icon: <Bell color="#FF69B4" />,
    title: "Hoạt động",
    description: "người mà bạn có thể biết, đang sử d...",
    chevron: true,
  },
  {
    icon: <ShoppingBag color="#FFA500" />,
    title: "TikTok Shop",
    description: "Tin nhắn của người bán được g... • 3 ngày",
    chevron: true,
  },
  {
    icon: <Inbox color="#000080" />,
    title: "Thông báo hệ thống",
    description: "TikTok: Khám phá ngay gợi ý như... • 9/19",
    chevron: true,
    badge: true,
  },
  {
    avatar:
      "https://image.lag.vn/upload/news/23/11/22/one-piece-tai-sao-thien-long-nhan-cuoi-dan-thuong-lam-vo-5_PUCT.jpg",
    title: "Thánh charlotte",
    description: "Đang tìm kiếm một nô lệ",
    camera: true,
  },
  {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOaC5rDlomXWDjy2S92C2QhIz-5nNmKJiRb_tr4je-6NFVeCqc0YzYglTCQrzFGPN9N8&usqp=CAU",
    title: "Cha của thằng ở trên",
    description: "Đã gửi",
    camera: true,
  },
  {
    avatar:
      "https://gamek.mediacdn.vn/133514250583805952/2020/2/5/photo-3-1580896277437746327347.jpg",
    title: "Donquixote Mjosgard",
    description: "Gửi lời chào bằng một sticker! • 7/28/2022",
  },
  {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM-a8a8K3WFelnsiY6YK5eYRJRrC6VH3VSsA&s",
    title: "Pé Mèo Khờ",
    description: "Hãy chào Pé Mèo Khờ",
    follow: true,
  },
  {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM-a8a8K3WFelnsiY6YK5eYRJRrC6VH3VSsA&s",
    title: "Pé Mèo Khờ",
    description: "Hãy chào Pé Mèo Khờ",
    follow: true,
  },
  {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM-a8a8K3WFelnsiY6YK5eYRJRrC6VH3VSsA&s",
    title: "Pé Mèo Khờ",
    description: "Hãy chào Pé Mèo Khờ",
    follow: true,
  },
  {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM-a8a8K3WFelnsiY6YK5eYRJRrC6VH3VSsA&s",
    title: "Pé Mèo Khờ",
    description: "Hãy chào Pé Mèo Khờ",
    follow: true,
  },
];

const accountRecommend = [
  {
    avatar: "https://avatars.githubusercontent.com/u/85284772?v=4",
    title: "Thanh Cảnh Kali",
    description: "Follow bạn",
    followed: true,
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/85284772?v=4",
    title: "Kẻ bị lãng quên",
    description: "Có thể bạn biết",
    followed: false,
  },
];

const userActive = [
  "https://gamek.mediacdn.vn/133514250583805952/2021/8/22/kop2-1629615610767588022142.jpg",
  "https://i.pinimg.com/736x/03/79/b4/0379b431813d7d7eac9808f81d66fcde.jpg",
  "https://staticg.sportskeeda.com/editor/2024/02/b0a50-17076959766485-1920.jpg?w=640",
  "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474116sST/anh-nami-one-piece-toc-cam_083559519.png",
  "https://static.wikia.nocookie.net/onepiece/images/c/c8/Zoro_2_anni_dopo.png/revision/latest?cb=20200414102752&path-prefix=vi",
  "https://static.wikia.nocookie.net/onepiece/images/8/8f/King_Anime_Infobox.png/revision/latest?cb=20200413151745&path-prefix=vi",
  "https://static.wikia.nocookie.net/luffy_kun_wiki/images/1/15/Legiao_KwJGtAvdPVj1.jpg.jpg/revision/latest?cb=20211017132507&path-prefix=vi",
  "https://cdn.idntimes.com/content-images/community/2020/01/4d2926af77ecaee94610a8db2d60d662-85f08b1bd0e0e56a912c96e831d50b75_600x400.jpg",
  "https://beebom.com/wp-content/uploads/2023/07/Garp-entry.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhcHl-X0THuSY2G2oCM3toka8M0SSAe_JuHw&s",
];

export default function NotificationsPage() {
  return (
    <GestureHandlerRootView>
      <Box className="flex-1" style={{ marginTop: Constants.statusBarHeight }}>
        <HStack space="md" reversed={false} className="pl-3">
          <HStack space="md">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Avatar size="xl">
                <AvatarFallbackText></AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM-a8a8K3WFelnsiY6YK5eYRJRrC6VH3VSsA&s",
                  }}
                />
                <AvatarBadge />
              </Avatar>
              {userActive.map((avatarUrl, index) => (
                <Avatar key={index} size="xl" className="mx-1">
                  <AvatarFallbackText></AvatarFallbackText>
                  <AvatarImage
                    source={{ uri: avatarUrl }}
                    alt={`user-avatar-${index}`}
                  />
                </Avatar>
              ))}
            </ScrollView>
          </HStack>
        </HStack>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box className="mx-3 mt-8">
            <VStack space="xl">
              {notifications.map((item, index) => (
                <Pressable key={index}>
                  <HStack>
                    {item.icon ? (
                      <Box className="mr-4 h-16 w-16 items-center justify-center rounded-full bg-white">
                        <Avatar key={index} size="lg" className="bg-white">
                          {item.icon}
                        </Avatar>
                      </Box>
                    ) : (
                      <Avatar key={index} size="lg">
                        <AvatarFallbackText></AvatarFallbackText>
                        <AvatarImage
                          source={{
                            uri: item.avatar,
                          }}
                          alt="avatar"
                        />
                      </Avatar>
                    )}
                    <VStack className="ml-2 flex-1" space="xs">
                      <Text className="text-lg">{item.title}</Text>
                      <Text
                        className="text-sm text-slate-500"
                        numberOfLines={1}>
                        {item.description}
                      </Text>
                    </VStack>
                    <HStack space="sm" className="items-center justify-center">
                      {item.badge && (
                        <Box className="h-2 w-2 rounded-full bg-red-500" />
                      )}
                      {item.camera && <Icon as={Camera} size="sm" />}
                      {item.follow && (
                        <Box className="rounded-full px-2 py-1">
                          <Text className="text-lg font-bold text-red-600">
                            + Follow
                          </Text>
                        </Box>
                      )}
                      {item.chevron && <Icon as={ChevronRight} size="xl" />}
                    </HStack>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </Box>
          <Text className="mx-3 mt-2 text-xl">Tài khoản được đề xuất</Text>
          <Box className="mx-3 mt-2">
            <VStack space="xl">
              {accountRecommend.map((item, index) => (
                <Pressable key={index}>
                  <HStack>
                    <Avatar key={index} size="lg">
                      <AvatarFallbackText></AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: item.avatar,
                        }}
                        alt="avatar"
                      />
                    </Avatar>

                    <VStack className="ml-2 flex-1" space="xs">
                      <Text className="text-lg">{item.title}</Text>
                      <Text
                        className="text-sm text-slate-500"
                        numberOfLines={1}>
                        {item.followed
                          ? "Đã follow bạn"
                          : item.description + " " + item.title}
                      </Text>
                    </VStack>

                    <HStack space="sm" className="items-center justify-center">
                      <Box className="min-w-10 rounded-full bg-red-500 px-2 py-1">
                        {item.followed ? (
                          <TouchableOpacity className="">
                            <Text className="text-lg font-bold text-white">
                              + Follow lại
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity className="">
                            <Text className="text-lg font-bold text-white">
                              + Follow
                            </Text>
                          </TouchableOpacity>
                        )}
                      </Box>
                    </HStack>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </Box>
        </ScrollView>
      </Box>
    </GestureHandlerRootView>
  );
}
