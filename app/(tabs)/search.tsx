import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Button,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  CameraView,
  useCameraPermissions,
  CameraType as ExpoCameraType,
} from "expo-camera";
import { CameraType } from "expo-camera/build/legacy/Camera.types";

export default function CameraScreen() {
  const [mode, setMode] = useState("video");
  const [duration, setDuration] = useState("15s");
  const [image, setImage] = useState(null);
  const [facing, setFacing] = useState<CameraType>(CameraType.back);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <CameraView ref={setCameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.text}>Pick Image</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, alignSelf: "center" }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 32,
  },
  button: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(128, 128, 128, 0.7)",
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
