import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Clock4, SearchIcon, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { FlatList, StatusBar, TouchableOpacity } from "react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import { SafeAreaView } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import clsx from "clsx";
import PostService from "@/services/PostService";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@/components/ui/modal";
import VideoItem from "@/components/VideoItem";
import { Spinner } from "@/components/ui/spinner";
import SearchService from "@/services/SearchService";

const height = StatusBar.currentHeight;

const suggestions = [
  "TikTok Dance Challenges",
  "Lip Sync Videos",
  "Comedy Skits",
  "DIY and Craft Tutorials",
  "Fitness and Workout Routines",
  "Cooking and Recipe Videos",
  "Fashion and Beauty Tips",
  "Pet Videos",
  "Travel Vlogs",
  "Life Hacks",
];

const SuggestionItem = ({
  title,
  onClick,
}: {
  title: string;
  onClick: (value: string) => void;
}) => {
  return (
    <Button
      variant="link"
      className="my-1 justify-start gap-4 px-2 py-1"
      onPress={() => {
        onClick(title);
      }}>
      <ButtonIcon>
        <Clock4 size={20} color="white" fill="gray" />
      </ButtonIcon>
      <ButtonText className="text-left text-lg font-semibold">
        {title}
      </ButtonText>
    </Button>
  );
};

const PreviewItem = ({
  post,
  onPress,
}: {
  post: Post;
  onPress: VoidFunction;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[calc(50%-16px)] max-w-[50%]">
      <VStack>
        <Image
          source={require("../../assets/static/thumbnail.png")}
          className="h-[250px] w-full rounded-lg object-contain"
          alt={post.title}
        />
        <Text>{post.title}</Text>
      </VStack>
    </TouchableOpacity>
  );
};

type TABS = "videos" | "users" | "topics";

export default function SearchScreen() {
  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState<TABS>("videos");
  const [searchResults, setSearchResults] = useState<{
    posts: (Post & { user: User })[];
    users: User[];
    topics: Topic[];
  }>({
    posts: [],
    users: [],
    topics: [],
  });
  const searchService = useRef(new SearchService());
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [previewVideo, setPreviewVideo] = React.useState<{
    show: boolean;
    item: Post | null;
  }>({
    show: false,
    item: null,
  });

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearchLoading(true);
    try {
      const results = await searchService.current.searchAll(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      // Handle error appropriately
    } finally {
      setSearchLoading(false);
    }
  };

  const renderResults = () => {
    switch (tab) {
      case "videos":
        return searchResults.posts.map((post) => (
          <PreviewItem
            post={post}
            key={post.post_id}
            onPress={() => {
              setPreviewVideo({
                show: true,
                item: post,
              });
            }}
          />
        ));
      case "users":
        return searchResults.users.map((user) => (
          // Add your UserItem component here
          <UserPreviewItem key={user.user_id} user={user} />
        ));
      case "topics":
        return searchResults.topics.map((topic) => (
          // Add your TopicItem component here
          <TopicPreviewItem key={topic.topic_id} topic={topic} />
        ));
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ marginTop: height }} className="px-4">
      {/* Header */}
      <VStack className="fixed left-0 right-0 top-0 h-fit border-b border-gray-50">
        <HStack className="mb-4 gap-4">
          <Input className="w-full flex-1 items-center rounded-lg px-4">
            <InputSlot>
              <SearchIcon size={22} color="black" />
            </InputSlot>
            <InputField
              placeholder="Search video..."
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              className="my-0 h-full py-0"
            />
            {query.length > 0 && (
              <InputSlot onPress={() => setQuery("")}>
                <X size={20} color="gray" />
              </InputSlot>
            )}
          </Input>

          <Button size="sm" variant="link" onPress={handleSearch}>
            <ButtonText className="text-lg text-red-500">Search</ButtonText>
          </Button>
        </HStack>
        <HStack className="w-full justify-start">
          {(["videos", "users", "topics"] as TABS[]).map((item) => (
            <Button
              key={item}
              className={clsx("px-4 text-black", {
                "border-b border-black": tab === item,
              })}
              variant="link"
              onPress={() => setTab(item)}>
              <ButtonText>{item[0].toUpperCase() + item.slice(1)}</ButtonText>
            </Button>
          ))}
        </HStack>
      </VStack>

      {/* Suggestions */}
      {query.length === 0 && (
        <FlatList
          data={suggestions}
          renderItem={({ item }) => (
            <SuggestionItem
              title={item}
              onClick={(value: string) => {
                setQuery(value);
                handleSearch();
              }}
            />
          )}
          keyExtractor={(item) => item}
        />
      )}

      {searchLoading && <Spinner />}

      {!searchLoading && query.length > 0 && (
        <VStack className="flex-row flex-wrap justify-between gap-4 pt-8">
          {renderResults()}
        </VStack>
      )}

      {previewVideo.show && previewVideo.item && (
        <Modal
          size="full"
          isOpen={previewVideo.show}
          onClose={() => {
            setPreviewVideo((prev) => ({
              ...prev,
              show: false,
            }));
          }}>
          <ModalContent className="bg-black p-0">
            <ModalBody className="p-0">
              <VideoItem
                item={previewVideo.item}
                isActive={true}
                onClosed={() =>
                  setPreviewVideo((prev) => ({ ...prev, show: false }))
                }
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </SafeAreaView>
  );
}
