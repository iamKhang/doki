import { Image } from "./ui/image";
import { Pressable } from "./ui/pressable";
import { Text } from "./ui/text";

interface PostItemProps {
  post: Post;
  onPress: () => void;
}

const PostItem = ({ post, onPress }: PostItemProps) => {
  return (
    <Pressable
      className="aspect-square w-1/3 p-1"
      onPress={onPress}>
      {post.thumbnail_url ? (
        <Image
          source={{ uri: post.thumbnail_url }}
          alt="thumbnail"
          className="h-full w-full rounded-lg"
        />
      ) : (
        <Text>Failed to load thumbnail</Text>
      )}
      <Text className="absolute bottom-3 left-2 rounded-s p-1 text-xs color-white">
        {post.like_total} Likes
      </Text>
    </Pressable>
  );
};

export default PostItem; 