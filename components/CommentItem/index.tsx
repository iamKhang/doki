import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const CommentItem = ({
  user_avatar,
  user_name,
  text: content,
}: {
  user_avatar?: string;
  user_name: string;
  text: string;
}) => {
  return (
    <HStack className="gap-2">
      <Avatar size="md">
        <AvatarFallbackText>
          {user_avatar ? "" : "Default Text"}
        </AvatarFallbackText>
        <AvatarImage
          source={
            user_avatar
              ? { uri: user_avatar }
              : require("@/assets/images/avatar.jpg")
          }
        />
      </Avatar>
      <VStack className="flex-1">
        <Text className="font-semibold text-secondary-500">{user_name}</Text>
        <Text className="">{content}</Text>
      </VStack>
    </HStack>
  );
};
export default CommentItem;
