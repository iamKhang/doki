import React, { useState } from "react";
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import {
  ArrowLeft,
  Mail,
  Lock,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signIn } from "@/store/authSlice";
import { Redirect, useRouter } from "expo-router";

export default function EnhancedLoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (email && password) {
      try {
        const result = await dispatch(signIn({ email, password }));
        if (result) {
          console.log("Login successful");
          router.push("/profile");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 bg-black p-6">
          <TouchableOpacity className="mb-8 mt-12">
            <ArrowLeft size={28} color="#FFF" />
          </TouchableOpacity>

          <VStack className="flex-1 justify-center space-y-8" space="lg">
            <Center>
              <Text className="text-3xl font-bold text-white">Login</Text>
            </Center>

            <VStack className="space-y-4" space="2xl">
              <Box className="relative">
                <Input
                  variant="outline"
                  size="xl"
                  className="rounded-xl border-0 bg-gray-800 px-2"
                  isDisabled={loading}
                  isInvalid={!!error}>
                  <Mail
                    className="absolute left-4 top-3.5"
                    size={24}
                    color="#FFFFFF80"
                  />
                  <InputField
                    placeholder="Email"
                    placeholderTextColor="#FFFFFF80"
                    value={email}
                    onChangeText={setEmail}
                    className="py-3 pl-12 pr-4 text-base text-white"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
              </Box>

              <Box className="relative">
                <Input
                  variant="outline"
                  size="xl"
                  className="rounded-xl border-0 bg-gray-800 px-4"
                  isDisabled={loading}
                  isInvalid={!!error}>
                  <Lock
                    className="absolute left-4 top-3.5"
                    size={24}
                    color="#FFFFFF80"
                  />
                  <InputField
                    placeholder="Password"
                    placeholderTextColor="#FFFFFF80"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="py-3 pl-12 pr-12 text-base text-white"
                  />
                  <InputSlot>
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}>
                      <InputIcon
                        as={showPassword ? EyeIcon : EyeOffIcon}
                        className="text-slate-200"
                      />
                    </TouchableOpacity>
                  </InputSlot>
                </Input>
              </Box>

              {error && <Text className="mt-2 text-red-500">{error}</Text>}

              <Button
                className="bg-white"
                size="xl"
                onPress={handleLogin}
                isDisabled={loading}>
                <Text className="text-lg font-bold text-black">
                  {loading ? "Logging in..." : "Đăng nhập"}
                </Text>
              </Button>
            </VStack>

            <TouchableOpacity
              onPress={() => console.log("Forgot password pressed")}>
              <Text className="text-center text-base text-white">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </VStack>

          <TouchableOpacity
            onPress={() => console.log("Create account pressed")}>
            <Text className="text-center text-base text-white">
              Don't have an account? <Text className="font-bold">Sign up</Text>
            </Text>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
