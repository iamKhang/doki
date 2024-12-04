import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Clock4, SearchIcon, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  FlatList,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
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
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

const height = StatusBar.currentHeight;

const suggestions = ["Dance", "Trend", "Doki", "#trip"];

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
    <TouchableOpacity onPress={onPress} className="flex-1">
      <VStack>
        <Image
          source={{ uri: post.thumbnail_url }}
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
    posts: Post[];
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
      // @ts-ignore
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      // Handle error appropriately
    } finally {
      setSearchLoading(false);
    }
  };

  const renderResults = () => {
    const hasResults = {
      videos: searchResults.posts.length > 0,
      users: searchResults.users.length > 0,
      topics: searchResults.topics.length > 0,
    }[tab];

    if (!hasResults) {
      return (
        <Center className="w-full py-4">
          <VStack space="md" className="items-center">
            <Text className="text-lg font-semibold">No results found</Text>
            <Text className="text-center text-gray-500">
              We couldn't find any {tab} matching your search
            </Text>
          </VStack>
        </Center>
      );
    }

    switch (tab) {
      case "videos":
        return (
          <FlatList
            data={searchResults.posts}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 16,
            }}
            renderItem={({ item: post }) => (
              <PreviewItem
                post={post}
                onPress={() => {
                  setPreviewVideo({
                    show: true,
                    item: post,
                  });
                }}
              />
            )}
            keyExtractor={(item) => item.post_id}
            contentContainerStyle={{ paddingTop: 8 }}
          />
        );
      case "users":
        return searchResults.users.map((user) => (
          <UserPreviewItem key={user.user_id} user={user} />
        ));
      case "topics":
        return searchResults.topics.map((topic) => (
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

      {searchLoading && (
        <Box className="py-4">
          <Spinner />
        </Box>
      )}

      {!searchLoading && query.length > 0 && renderResults()}

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
            <ModalBody className="fixed bottom-0 left-0 right-0 top-0 p-0">
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

const UserPreviewItem = ({ user }: { user: User }) => {
  return (
    <HStack className="w-full items-start gap-2 rounded-lg bg-white p-2 px-4 shadow-sm">
      <Avatar size="md">
        <AvatarFallbackText></AvatarFallbackText>
        <AvatarImage
          source={{
            uri: user.avatar_url,
          }}
          alt="avatar"
        />
      </Avatar>
      <VStack>
        <Text className="text-lg font-semibold">
          {user.first_name} {user.last_name}
        </Text>
        <Text className="text-sm text-gray-500">@{user.username}</Text>
      </VStack>
    </HStack>
  );
};

const TopicPreviewItem = ({ topic }: { topic: Topic }) => {
  return <Text>{topic.topic_name}</Text>;
};
