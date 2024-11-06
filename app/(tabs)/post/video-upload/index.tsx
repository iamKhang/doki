import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Settings } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Link, useLocalSearchParams } from "expo-router";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Constants from "expo-constants";
import {
  AArrowDown,
  CaseSensitive,
  ChevronDown,
  ChevronLeft,
  Disc3,
  Instagram,
  Music,
  Send,
  Settings2,
  Sticker,
} from "lucide-react-native";
import { Avatar } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

export default function VideoUploadScreen() {
  const { videoUri } = useLocalSearchParams() as {
    videoUri: string | string[];
  };

  if (!videoUri) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">No video selected.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="relative flex-1 bg-black">
        <View className="absolute left-1/2 top-10 z-10 flex -translate-x-1/2 flex-row items-center rounded-2xl bg-slate-600 px-4 py-1">
          <Music size={20} color="white" />
          <Text className="ml-3 text-white">Thêm âm thanh</Text>
        </View>
        <View className="absolute left-[10%] top-10 z-10 flex -translate-x-1/2 flex-row items-center">
          <Link href="/post/new-post" asChild>
            <TouchableOpacity style={{ padding: 10 }}>
              <ChevronLeft size={30} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
        <View className="absolute right-[2%] top-20 z-10 flex h-1/2 -translate-x-1/2 items-center justify-between space-y-8">
          <TouchableOpacity>
            <Settings2 size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Send size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <CaseSensitive size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Sticker size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Instagram size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <ChevronDown size={30} color="white" />
          </TouchableOpacity>
        </View>
        <Video
          source={{ uri: Array.isArray(videoUri) ? videoUri[0] : videoUri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }} // Cho video bao phủ toàn màn hình
        />
      </View>
      <View className="w-full flex-row justify-center space-x-2 bg-black px-3 py-5">
        <Button className="mr-2 flex flex-1 flex-row items-center rounded-full bg-white px-4 py-2">
          <Image
            source={{
              uri: "https://image.lag.vn/upload/news/23/11/22/one-piece-tai-sao-thien-long-nhan-cuoi-dan-thuong-lam-vo-5_PUCT.jpg",
            }}
            alt="avatar"
            className="mr-2 h-6 w-6 rounded-full border border-gray-300"
          />
          <Text className="font-bold text-black">Nhật ký của bạn</Text>
        </Button>
        <Button className="ml-2 flex-1 items-center rounded-full bg-red-500 px-4 py-2">
          <Text className="font-bold text-white">Tiếp</Text>
        </Button>
      </View>
    </GestureHandlerRootView>
  );
}
