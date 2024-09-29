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
import { TouchableOpacity } from "react-native-gesture-handler";
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
      "https://vcdn1-giaitri.vnecdn.net/2020/12/27/Jack-5775-1609042368.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=AyQh7XQknwvQvA1VLzYvuw",
    title: "Pé Mèo Khờ",
    description: "Hãy chào Pé Mèo Khờ",
    follow: true,
  },
];

export default function NotificationsPage() {
  return (
    <Box className="flex-1" style={{ marginTop: Constants.statusBarHeight }}>
      <HStack space="md" reversed={false} className="pl-3">
        <Box>
          <Avatar size="xl">
            <AvatarFallbackText></AvatarFallbackText>
            <AvatarImage
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrY7dJj0QnImGcypj9oBdr9u9joHrxgaKY_g&s",
              }}
            />
            <AvatarBadge />
          </Avatar>
        </Box>
        {[...Array(5)].map((_, index) => (
          <Box key={index}>
            <Avatar key={index} size="xl">
              <AvatarFallbackText></AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: "https://img.hoidap247.com/picture/question/20200508/large_1588936738888.jpg?v=0",
                }}
              />
            </Avatar>
          </Box>
        ))}
      </HStack>
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
                    />
                  </Avatar>
                )}
                <VStack className="ml-2 flex-1" space="xs">
                  <Text className="text-lg">{item.title}</Text>
                  <Text className="text-sm text-slate-500" numberOfLines={1}>
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
    </Box>
  );
}
