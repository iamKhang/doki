// CameraScreen.tsx
import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { ResizeMode, Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const router = useRouter();

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleRecord = async () => {
    if (cameraRef.current && isCameraReady) {
      if (isRecording) {
        // Dừng ghi video và thực hiện tiếp bước xử lý như khi chọn video từ thư viện
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        // Kiểm tra quyền truy cập microphone
        if (!microphonePermission?.granted) {
          const micPermission = await requestMicrophonePermission();
          if (!micPermission.granted) {
            alert(
              "Bạn cần cấp quyền truy cập microphone để quay video có âm thanh.",
            );
            return;
          }
        }

        try {
          setIsRecording(true);
          const video = await cameraRef.current.recordAsync({
            maxDuration: 60, // Giới hạn thời gian quay video (tính bằng giây)
          });

          if (video) {
            // Sau khi quay xong, chuyển tiếp đến màn hình xử lý video
            router.push({
              pathname: "/post/video-upload",
              params: { videoUri: encodeURIComponent(video.uri) },
            });
          } else {
            setIsRecording(false);
            console.error("Video is undefined");
          }
        } catch (error) {
          console.error("Lỗi khi ghi video:", error);
          setIsRecording(false);
        }
      }
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      router.push({
        pathname: "/post/video-upload",
        params: { videoUri: encodeURIComponent(uri) },
      });
    } else {
      alert("Bạn chưa chọn video nào.");
    }
  };

  const handleBack = () => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    }
    router.back();
  };

  if (!permission) {
    // Đang tải quyền truy cập camera
    return <View />;
  }

  if (!permission.granted) {
    // Chưa cấp quyền truy cập camera
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Chúng tôi cần quyền truy cập camera để hiển thị camera
        </Text>
        <Button onPress={requestPermission} title="Cấp quyền truy cập camera" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={() => setIsCameraReady(true)}
          onMountError={(error) =>
            console.error("Lỗi khi mount camera:", error)
          }
          videoQuality="1080p"
          mode="video"
          active={true}>
          {/* Header Buttons */}
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleCameraFacing} className="p-2">
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <Text className="text-lg text-white">Thêm âm thanh</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-2" onPress={handleBack}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* Footer Buttons */}
      <View
        className="absolute bottom-10 left-5 right-5 flex-row items-center justify-around"
        style={styles.footerButtons}>
        <TouchableOpacity className="p-4">
          <Ionicons name="color-filter" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRecord}
          className={
            isRecording
              ? "flex h-20 w-20 items-center justify-center rounded-full bg-red-600"
              : "flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-600 bg-white"
          }
          style={styles.recordButton}>
          {isRecording ? (
            <Ionicons name="stop" size={40} color="white" />
          ) : (
            <View className="h-16 w-16 rounded-full bg-red-600" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={pickVideo} className="p-4">
          <Ionicons name="image" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
    padding: 20,
  },
  permissionText: {
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  footerButtons: {
    zIndex: 3,
  },
  recordButton: {
    zIndex: 4,
  },
});
