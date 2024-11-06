import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Link, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { RefreshCcw, ImageIcon, X, Filter } from "lucide-react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const cameraRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleRecord = async () => {
    if (cameraRef.current) {
      if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        setVideoUri(video.uri);
        setIsRecording(false);
      }
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const router = useRouter();
  useEffect(() => {
    if (selectedImage) {
      router.push(
        `/post/video-upload?videoUri=${encodeURIComponent(selectedImage)}`,
      );
    }
  }, [selectedImage, router]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center bg-black">
        <Text className="pb-3 text-center text-white">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Allow camera access" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing={facing}
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}>
        <View className="absolute top-10 w-full flex-row justify-between px-5">
          <TouchableOpacity onPress={toggleCameraFacing}>
            <RefreshCcw size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-white">Thêm âm thanh</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-10 w-full flex-row justify-around px-5">
          <TouchableOpacity>
            <Filter size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRecord}
            className="h-16 w-16 items-center justify-center rounded-full bg-white">
            <View
              className={`h-12 w-12 rounded-full ${isRecording ? "bg-red-700" : "bg-red-500"}`}
            />
          </TouchableOpacity>
          {/* <Link
            href={{ pathname: "/post/video-upload", params: { selectedImage } }}
            asChild
          > */}
          <TouchableOpacity onPress={pickVideo}>
            <ImageIcon size={24} color="white" />
          </TouchableOpacity>
          {/* </Link> */}
        </View>
      </CameraView>
      {/* {videoUri && (
        <Video
          source={{ uri: videoUri }}
          shouldPlay
          style={{ width: "100%", height: 300 }}
          resizeMode="contain"
        />
      )} */}
    </View>
  );
}
