// VideoUploadScreen.tsx
import React, { useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Link, useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { uploadFile } from "@/services/FileService";
import { uriToBase64 } from "@/utils/uriToBase64";

export default function VideoUploadScreen() {
  const params = useLocalSearchParams() as {
    videoUri: string;
  };

  const { videoUri } = params;
  const [uploading, setUploading] = useState(false);

  if (!videoUri) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">No video selected.</Text>
      </View>
    );
  }

  const handleUpload = async () => {
    try {
      setUploading(true);
      // Chuyển đổi URI thành Blob
      const base64 = await uriToBase64(videoUri);
      const randomSeed = Date.now();
      const fileName = `videos/${randomSeed}.mp4`;
      // Tải lên Supabase
      const publicUrl = await uploadFile(fileName, base64);
      console.log("Public URL: ", publicUrl);

      if (publicUrl) {
        Alert.alert("Thành công", "Video đã được tải lên thành công!");
        // Bạn có thể chuyển hướng hoặc lưu URL vào cơ sở dữ liệu ở đây
        // Ví dụ:
        // await saveVideoUrlToDatabase(publicUrl);
        // router.push("/some-other-screen");
      } else {
        Alert.alert("Lỗi", "Không thể tải lên video.");
      }
    } catch (error) {
      console.error("Upload error in ui:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải lên video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="relative flex-1 bg-black">
        {/* Các thành phần UI khác */}
        <Video
          source={{ uri: Array.isArray(videoUri) ? videoUri[0] : videoUri }}
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
        <Button
          className="ml-2 flex-1 items-center rounded-full bg-red-500 px-4 py-2"
          onPress={handleUpload}
          disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-bold text-white">Tiếp</Text>
          )}
        </Button>
      </View>
    </GestureHandlerRootView>
  );
}
