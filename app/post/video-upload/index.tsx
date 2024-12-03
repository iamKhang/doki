// VideoUploadScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { uploadFile } from "@/services/FileService";
import { uriToBase64 } from "@/utils/uriToBase64";
import Constants from "expo-constants";
import { ChevronLeft } from "lucide-react-native";

export default function VideoUploadScreen() {
  const params = useLocalSearchParams() as {
    videoUri: string;
  };
  const decodedUri = decodeURIComponent(params.videoUri);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  if (!decodedUri) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">No video selected.</Text>
      </View>
    );
  }

  const handleContinue = () => {
    if (decodedUri) {
      router.push({
        pathname: "/post/post-content",
        params: { videoUri: params.videoUri },
      });
    } else {
      Alert.alert("Lỗi", "Không có video nào để tiếp tục.");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="relative flex-1 bg-black">
        {/* Video Preview */}
        <Video
          source={{ uri: decodedUri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        />

        {/* Header với nút back */}
        <View
          className="flex-row items-center px-4"
          style={{ marginTop: Constants.statusBarHeight }}>
          <TouchableOpacity
            onPress={handleBack}
            className="rounded-full bg-black/30 p-2">
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Footer Buttons */}
        <View className="absolute bottom-0 w-full flex-row justify-between space-x-2 bg-black/50 px-3 py-5">
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

          <Button
            className="ml-2 flex-1 items-center rounded-full bg-[#D91656] px-4 py-2"
            onPress={handleContinue}>
            <Text className="font-bold text-white">Tiếp</Text>
          </Button>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
