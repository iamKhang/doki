import { useState } from "react";
import { Button, ButtonText } from "../ui/button";
import { CloseIcon, Icon } from "../ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../ui/modal";
import { Text } from "../ui/text";
import { Input, InputField, InputSlot } from "../ui/input";
import { Lock, Mail } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signIn } from "@/store/authSlice";
import { Image } from "../ui/image";

interface AuthModalProps {
  open: boolean;
  setOpen: (show: boolean) => void;
}

function AuthModal({ open, setOpen }: AuthModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (email && password) {
      // Dispatch the signIn action with email and password
      try {
        await dispatch(signIn({ email, password }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-xl font-semibold text-typography-950">
            Login to Doki
          </Text>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900 group-[:hover]/modal-close-button:stroke-background-700"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className="gap-2">
          <Text size="sm" className="mb-4 text-typography-500">
            Login to your account to access all features of Doki
          </Text>

          <Image
            source={require("./undraw_post_p670.png")}
            alt="Login Illustrator"
            className="mx-auto h-[100px] w-[100px]"
          />

          <Input
            variant="outline"
            size="md"
            className="mb-2"
            isDisabled={loading}
            isInvalid={!!error}
            isReadOnly={false}>
            <InputSlot className="ml-2">
              <Mail color="#000" size={15} />
            </InputSlot>
            <InputField
              tabIndex={0}
              placeholder="Your Email"
              value={email}
              onChangeText={setEmail}
            />
          </Input>

          <Input
            variant="outline"
            size="md"
            isDisabled={loading}
            isInvalid={!!error}
            isReadOnly={false}>
            <InputSlot className="ml-2" tabIndex={-1}>
              <Lock color="#000" size={15} />
            </InputSlot>
            <InputField
              tabIndex={0}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </Input>

          {error && (
            <Text size="sm" className="mt-2 text-red-500">
              {error}
            </Text>
          )}
        </ModalBody>
        <ModalFooter className="flex flex-col">
          <Button className="w-full" onPress={handleLogin} isDisabled={loading}>
            <ButtonText>{loading ? "Logging in..." : "Login now"}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AuthModal;
