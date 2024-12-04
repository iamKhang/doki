import React, { useState } from "react";
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
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
  Home,
} from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signIn, signUp } from "@/store/authSlice";
import { Redirect, useRouter } from "expo-router";
import { HStack } from "@/components/ui/hstack";

export default function EnhancedLoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [view, setView] = useState<"login" | "signup">("login");
  const [errorMessages, setErrorMessages] = useState<string>("");

  const handleLogin = async () => {
    if (email && password) {
      try {
        const result = await dispatch(signIn({ email, password }));
        if (result) {
          if (router.canGoBack()) {
            router.back();
          }
          router.push("/(tabs)");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setErrorMessages("All fields are required");
      return;
    }

    if (password.length < 6) {
      setErrorMessages("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessages("Passwords do not match");
      return;
    }
    try {
      // Replace with your signup logic
      const result = await dispatch(signUp({ email, password }));
      if (result) {
        router.push("/(tabs)/profile");
      }
      setErrorMessages("Sign up successful");
    } catch (error) {
      setErrorMessages("Sign up failed");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 bg-black p-6">
          <HStack className="items-center justify-between gap-2">
            {router.canGoBack() && (
              <TouchableOpacity
                className="mb-8 mt-12"
                onPress={() => router.back()}>
                <ArrowLeft size={28} color="#FFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="mb-8 mt-12"
              onPress={() => router.replace("/(tabs)")}>
              <Home size={25} color="#FFF" />
            </TouchableOpacity>
          </HStack>

          <VStack className="flex-1 justify-center space-y-8" space="lg">
            <Center>
              <Text className="text-3xl font-bold text-white">
                {view === "login" ? "Login" : "Sign up"} to Doki
              </Text>
            </Center>

            <VStack className="space-y-4" space="2xl">
              <Box className="relative">
                <Input
                  variant="outline"
                  size="xl"
                  className="rounded-xl border-0 bg-gray-800 px-4"
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
                    className="px-4 py-3 pr-4 text-base text-white"
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
                    className="px-4 py-3 text-base text-white"
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

              {view === "signup" && (
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
                      placeholder="Confirm Password"
                      placeholderTextColor="#FFFFFF80"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPassword}
                      className="px-4 py-3 text-base text-white"
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
              )}

              {error && <Text className="text-red-500">* {error}</Text>}
              {errorMessages && (
                <Text className="text-red-500">* {errorMessages}</Text>
              )}

              {view === "login" ? (
                <Button
                  className="bg-white"
                  size="xl"
                  onPress={handleLogin}
                  isDisabled={loading}>
                  <Text className="text-lg font-bold text-black">
                    {loading ? "Logging in..." : "Login"}
                  </Text>
                </Button>
              ) : (
                <Button
                  className="bg-white"
                  size="xl"
                  onPress={handleSignup}
                  isDisabled={loading}>
                  <Text className="text-lg font-bold text-black">
                    {loading ? "Signing..." : "Sign up"}
                  </Text>
                </Button>
              )}
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
              {view === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <TouchableWithoutFeedback
                onPress={() =>
                  setView((prev) => (prev == "login" ? "signup" : "login"))
                }>
                <Text className="pl-2 font-bold text-blue-500">
                  {view === "login" ? "Sign up" : "Login"}
                </Text>
              </TouchableWithoutFeedback>
            </Text>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
