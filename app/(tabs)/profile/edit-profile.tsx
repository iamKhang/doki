import React, { useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import { useRouter } from "expo-router";
import { ChevronLeft, Camera, User, Mail, AtSign } from "lucide-react-native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { uploadFile } from "@/services/FileService";
import { uriToBase64 } from "@/utils/uriToBase64";
import { base64ToArrayBuffer } from "@/utils/base64ToArrayBuffer";
import UserService from "@/services/UserService";
import { setUser } from "@/store/slices/authSlice";

export default function EditProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: auth.appUser?.first_name || "",
    lastName: auth.appUser?.last_name || "",
    username: auth.appUser?.username || "",
    email: auth.appUser?.email || "",
    avatarUrl: auth.appUser?.avatar_url || null,
  });

  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!auth.appUser?.user_id) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
      return;
    }

    try {
      setLoading(true);

      let newAvatarUrl = formData.avatarUrl;

      if (newAvatarUri) {
        const base64 = await uriToBase64(newAvatarUri);
        const arrayBuffer = base64ToArrayBuffer(base64);
        const fileName = `avatars/${auth.appUser.user_id}_${Date.now()}.jpg`;
        newAvatarUrl = await uploadFile(fileName, arrayBuffer, "image/jpeg");
      }

      const userData = {
        user_id: auth.appUser.user_id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        email: formData.email,
        avatar_url: newAvatarUrl,
      };

      const userService = new UserService();
      const updatedUser = await userService.update(
        auth.appUser.user_id,
        userData,
      );

      dispatch(setUser(updatedUser));

      Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="flex-1 bg-gray-50"
      style={{ paddingTop: Constants.statusBarHeight }}>
      {/* Header */}
      <HStack className="items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <HStack space="md" className="items-center">
          <TouchableOpacity onPress={handleBack}>
            <ChevronLeft size={28} color="#D91656" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Chỉnh sửa hồ sơ</Text>
        </HStack>
      </HStack>

      <ScrollView className="flex-1">
        {/* Avatar Section */}
        <Box className="mb-4 bg-white p-6">
          <VStack className="items-center space-y-4">
            <Box className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm">
              <Image
                source={{
                  uri:
                    newAvatarUri ||
                    formData.avatarUrl ||
                    "https://placeholder.com/150",
                }}
                alt="Avatar"
                className="h-full w-full"
              />
              <TouchableOpacity
                onPress={pickImage}
                className="absolute bottom-2 right-2 rounded-full bg-[#D91656] p-3 shadow-lg">
                <Camera size={20} color="white" />
              </TouchableOpacity>
            </Box>
            <Text className="text-sm text-gray-500">
              Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện
            </Text>
          </VStack>
        </Box>

        {/* Form Fields */}
        <Box className="bg-white px-4 py-6">
          <VStack space="lg">
            {/* First Name Input */}
            <VStack space="xs">
              <Text className="ml-1 font-medium text-gray-600">Tên</Text>
              <Box className="rounded-xl bg-gray-50">
                <Input
                  variant="outline"
                  size="xl"
                  className="border-0"
                  isDisabled={false}
                  isInvalid={false}
                  isReadOnly={false}>
                  <HStack className="items-center px-4">
                    <User size={20} color="#6B7280" />
                    <InputField
                      className="ml-3 flex-1 text-base"
                      value={formData.firstName}
                      onChangeText={(text: string) =>
                        setFormData({ ...formData, firstName: text })
                      }
                      placeholder="Nhập tên của bạn"
                    />
                  </HStack>
                </Input>
              </Box>
            </VStack>

            {/* Last Name Input */}
            <VStack space="xs">
              <Text className="ml-1 font-medium text-gray-600">Họ</Text>
              <Box className="rounded-xl bg-gray-50">
                <Input
                  variant="outline"
                  size="xl"
                  className="border-0"
                  isDisabled={false}
                  isInvalid={false}
                  isReadOnly={false}>
                  <HStack className="items-center px-4">
                    <User size={20} color="#6B7280" />
                    <InputField
                      className="ml-3 flex-1 text-base"
                      value={formData.lastName}
                      onChangeText={(text: string) =>
                        setFormData({ ...formData, lastName: text })
                      }
                      placeholder="Nhập họ của bạn"
                    />
                  </HStack>
                </Input>
              </Box>
            </VStack>

            {/* Username Input */}
            <VStack space="xs">
              <Text className="ml-1 font-medium text-gray-600">
                Tên người dùng
              </Text>
              <Box className="rounded-xl bg-gray-50">
                <Input
                  variant="outline"
                  size="xl"
                  className="border-0"
                  isDisabled={false}
                  isInvalid={false}
                  isReadOnly={false}>
                  <HStack className="items-center px-4">
                    <AtSign size={20} color="#6B7280" />
                    <InputField
                      className="ml-3 flex-1 text-base"
                      value={formData.username}
                      onChangeText={(text: string) =>
                        setFormData({ ...formData, username: text })
                      }
                      placeholder="Nhập tên người dùng"
                    />
                  </HStack>
                </Input>
              </Box>
            </VStack>

            {/* Email Input */}
            <VStack space="xs">
              <Text className="ml-1 font-medium text-gray-600">Email</Text>
              <Box className="rounded-xl bg-gray-50">
                <Input
                  variant="outline"
                  size="xl"
                  className="border-0"
                  isDisabled={true}
                  isInvalid={false}
                  isReadOnly={false}>
                  <HStack className="items-center px-4">
                    <Mail size={20} color="#6B7280" />
                    <InputField
                      className="ml-3 flex-1 text-base text-gray-500"
                      value={formData.email}
                      onChangeText={(text: string) =>
                        setFormData({ ...formData, email: text })
                      }
                      placeholder="Nhập email"
                      keyboardType="email-address"
                    />
                  </HStack>
                </Input>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>

      {/* Save Button */}
      <Box className="border-t border-gray-200 bg-white p-4">
        <Button
          size="lg"
          className="rounded-xl bg-[#D91656]"
          onPress={handleSave}
          disabled={loading}>
          <HStack space="sm" className="items-center px-4">
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-medium text-white">
                Lưu thay đổi
              </Text>
            )}
          </HStack>
        </Button>
      </Box>
    </Box>
  );
}
