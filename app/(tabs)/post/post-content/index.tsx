// components/VideoPostCreation.tsx
import React, { useEffect, useState } from "react";
import { TouchableOpacity, ScrollView, View, Alert } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { useLocalSearchParams } from "expo-router";
import {
  Hash,
  AtSign,
  MapPin,
  Link2,
  Users,
  ChevronLeft,
  X,
} from "lucide-react-native";
import * as VideoThumbnails from "expo-video-thumbnails";
import Constants from "expo-constants";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { uploadFile } from "@/services/FileService";
import { uriToBase64 } from "@/utils/uriToBase64";
import { base64ToArrayBuffer } from "@/utils/base64ToArrayBuffer";
import TopicService from "@/services/TopicService";
import PostService from "@/services/PostService";
import PostTopicService from "@/services/PostTopicService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

async function generateThumbnail(videoUri: string, timeInSeconds: number) {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: timeInSeconds * 1000,
    });
    return uri;
  } catch (error) {
    console.warn("Thumbnail generation error:", error);
    return null;
  }
}

export default function VideoPostCreation() {
  const [uploading, setUploading] = useState(false);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const auth = useSelector((state: RootState) => state.auth);
  const params = useLocalSearchParams() as {
    videoUri: string;
  };
  const [description, setDescription] = useState("");
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { videoUri } = params;
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null); // Thêm state để lưu URL video đã upload

  useEffect(() => {
    const loadInitialTopics = async () => {
      setLoading(true);
      const topicService = new TopicService();
      const initialTopics = await topicService.getAll();
      setAvailableTopics(initialTopics as Topic[]);
      console.log("Initial topics: ", initialTopics);
      setLoading(false);
    };

    loadInitialTopics();
  }, []);

  const handleTopicSelection = (topicId: string) => {
    if (selectedTopics.some((t) => t.topic_id === topicId)) {
      setSelectedTopics(selectedTopics.filter((t) => t.topic_id !== topicId));
    } else {
      const selectedTopic = availableTopics.find((t) => t.topic_id === topicId);
      if (selectedTopic) {
        setSelectedTopics([...selectedTopics, selectedTopic]);
      }
    }
  };

  useEffect(() => {
    const loadThumbnail = async () => {
      const uri = await generateThumbnail(params.videoUri, 1);
      setThumbnailUri(uri);
    };
    loadThumbnail();
  }, [params.videoUri]);

  const handlePostSubmission = async () => {
    if (!auth.appUser || !auth.appUser.user_id) {
      Alert.alert("Lỗi", "Bạn cần đăng nhập trước khi đăng bài.");
      return;
    }

    try {
      setUploading(true);

      // Chuyển đổi URI thành Base64
      const base64 = await uriToBase64(videoUri);
      console.log("Base64 string:", base64.substring(0, 100)); // Log phần đầu để kiểm tra

      // Chuyển đổi Base64 thành ArrayBuffer
      const arrayBuffer = base64ToArrayBuffer(base64);
      console.log("ArrayBuffer:", arrayBuffer);

      // Tạo tên file ngẫu nhiên
      const randomSeed = Date.now();
      const fileName = `videos/${randomSeed}.mp4`;

      // Upload file lên Supabase Storage
      const publicUrl = await uploadFile(fileName, arrayBuffer);
      console.log("Public URL:", publicUrl);

      if (!publicUrl) {
        throw new Error("Không thể tải lên video.");
      }

      setUploadedVideoUrl(publicUrl); // Lưu URL video đã upload

      // Chuẩn bị dữ liệu bài đăng
      const postData: Post = {
        user_id: auth.appUser.user_id,
        title: description,
        video: publicUrl,
        thumbnail_url: thumbnailUri || undefined,
        like_total: 0,
        view_total: 0,
      };

      // Lưu bài đăng sử dụng PostService
      const postService = new PostService();
      const createdPost = await postService.create(postData);

      // Lưu các chủ đề đã chọn sử dụng PostTopicService
      const postTopicService = new PostTopicService();
      await postTopicService.savePostTopics(
        createdPost.post_id,
        selectedTopics,
      );

      // Thông báo thành công
      Alert.alert(
        "Thành công",
        "Video và bài đăng đã được tải lên thành công!",
      );
    } catch (error: any) {
      // Sử dụng kiểu `any` để lấy thông báo lỗi chi tiết
      console.error("Error in post submission:", error);
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi đăng video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      className="flex-1 bg-white"
      style={{ paddingTop: Constants.statusBarHeight }}>
      <ScrollView className="flex-1">
        <VStack className="space-y-4 p-4" space="sm">
          <TouchableOpacity>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>

          <HStack className="space-x-4" space="2xl">
            <Textarea
              size="lg"
              isReadOnly={false}
              isInvalid={false}
              isDisabled={false}
              className="h-[100%] w-[70%] border-0">
              <TextareaInput
                value={description}
                onChangeText={setDescription}
                placeholder="Your text goes here..."
              />
            </Textarea>

            <Box className="relative h-36 w-28 overflow-hidden rounded-lg">
              {thumbnailUri && (
                <Image
                  source={{ uri: thumbnailUri }}
                  alt="Video preview"
                  className="h-full w-full flex-1 object-cover"
                  resizeMode="cover"
                />
              )}
              <VStack className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <Text className="text-xs text-white">Sửa ảnh bìa</Text>
              </VStack>
            </Box>
          </HStack>

          {/* Quick Actions */}
          <HStack className="" space="md">
            <Button
              variant="outline"
              className="flex-row items-center space-x-1 rounded-full px-4 py-2">
              <Hash size={16} />
              <Text>Hashtag</Text>
            </Button>
            <Button
              variant="outline"
              className="flex-row items-center space-x-1 rounded-full px-4 py-2">
              <AtSign size={16} />
              <Text>Nhắc đến</Text>
            </Button>
          </HStack>

          {/* Location */}
          <TouchableOpacity>
            <HStack className="items-center justify-between border-b border-gray-200 py-4">
              <HStack className="items-center space-x-2">
                <MapPin size={24} />
                <Text className="text-base">Vị trí</Text>
              </HStack>
              <Text className="text-gray-600">Hồ Chí Minh</Text>
            </HStack>
          </TouchableOpacity>

          {/* Add Link */}
          <TouchableOpacity>
            <HStack className="items-center justify-between border-b border-gray-200 py-4">
              <HStack className="items-center space-x-2">
                <Link2 size={24} />
                <Text className="text-base">Thêm liên kết</Text>
              </HStack>
            </HStack>
          </TouchableOpacity>

          {/* Privacy */}
          <TouchableOpacity>
            <HStack className="items-center justify-between border-b border-gray-200 py-4">
              <HStack className="items-center space-x-2">
                <Users size={24} />
                <Text className="text-base">
                  Follower có thể xem bài đăng này
                </Text>
              </HStack>
            </HStack>
          </TouchableOpacity>

          {/* Selected Topics */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack className="space-x-2">
              {selectedTopics.map((topic: Topic) => (
                <Button
                  key={topic.topic_id}
                  variant="solid"
                  className="flex-row items-center space-x-1 rounded-full bg-blue-500 px-4 py-2"
                  onPress={() => handleTopicSelection(topic.topic_id)}>
                  <Text className="text-white">{topic.topic_name}</Text>
                  <X size={16} color="white" />
                </Button>
              ))}
            </HStack>
          </ScrollView>

          {/* Available Topics */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack className="space-x-2">
              {availableTopics
                .filter(
                  (topic: Topic) =>
                    !selectedTopics.some((t) => t.topic_id === topic.topic_id),
                )
                .map((topic: Topic) => (
                  <Button
                    key={topic.topic_id}
                    variant="outline"
                    className="flex-row items-center space-x-1 rounded-full px-4 py-2"
                    onPress={() => handleTopicSelection(topic.topic_id)}>
                    <Hash size={16} />
                    <Text>{topic.topic_name}</Text>
                  </Button>
                ))}
            </HStack>
          </ScrollView>
        </VStack>
      </ScrollView>

      {/* Bottom Actions */}
      <HStack className="border-t border-gray-200 p-4">
        <Button variant="outline" className="mr-2 flex-1">
          <Text>Nháp</Text>
        </Button>
        <Button
          className="ml-2 flex-1 bg-red-500"
          onPress={handlePostSubmission}
          disabled={uploading}>
          <Text className="text-white">Đăng</Text>
        </Button>
      </HStack>
    </Box>
  );
}
