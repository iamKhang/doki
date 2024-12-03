import React, { useState, useRef } from "react";
import { TouchableOpacity, ScrollView, Share } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Copy,
  Share as ShareIcon,
  Check,
} from "lucide-react-native";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";

export default function ShareProfile() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [copied, setCopied] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const alertTimeout = useRef<NodeJS.Timeout>();
  const profileUrl = `doki/${auth.appUser?.username || ""}`;

  const handleBack = () => {
    router.back();
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(profileUrl);
    setCopied(true);
    setShowAlert(true);

    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }

    alertTimeout.current = setTimeout(() => {
      setShowAlert(false);
      setCopied(false);
    }, 3000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Xem hồ sơ của tôi trên Doki: ${profileUrl}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      className="flex-1 bg-[#FF2C55]"
      style={{ paddingTop: Constants.statusBarHeight }}>
      <HStack className="items-center justify-between px-6 py-4">
        <TouchableOpacity
          onPress={handleBack}
          className="rounded-full bg-black/10 p-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">Chia sẻ hồ sơ</Text>
        <Box className="w-10" />
      </HStack>

      <ScrollView className="flex-1">
        <VStack className="items-center space-y-8 p-6" space="lg">
          <VStack className="items-center" space="sm">
            <Box className="h-28 w-28 overflow-hidden rounded-full border-4 border-white/30">
              <Image
                source={{
                  uri:
                    auth.appUser?.avatar_url || "https://placeholder.com/150",
                }}
                alt="Avatar"
                className="h-full w-full"
              />
            </Box>
            <VStack className="items-center space-y-1">
              <Text className="text-2xl font-bold text-white">
                {auth.appUser?.username || "Username"}
              </Text>
              <Text className="text-sm text-white/80">
                Quét mã QR để xem hồ sơ của tôi
              </Text>
            </VStack>
          </VStack>

          <Box className="rounded-3xl bg-white p-8">
            <Box className="rounded-2xl border-8 border-[#FF2C55]/10">
              <QRCode
                value={profileUrl}
                size={200}
                color="#FF2C55"
                backgroundColor="#FFFFFF"
              />
            </Box>
          </Box>

          <Box className="w-full rounded-2xl bg-white/10">
            <HStack className="items-center justify-between p-4">
              <Text className="flex-1 text-base text-white" numberOfLines={1}>
                {profileUrl}
              </Text>
              <TouchableOpacity
                onPress={handleCopyLink}
                className="ml-3 rounded-xl bg-white/20 p-3">
                {copied ? (
                  <Check size={20} color="white" />
                ) : (
                  <Copy size={20} color="white" />
                )}
              </TouchableOpacity>
            </HStack>
          </Box>

          <VStack className="w-full" space="lg">
            <Button
              size="lg"
              className="rounded-xl bg-white"
              onPress={handleShare}>
              <HStack space="sm" className="items-center px-4">
                <ShareIcon size={20} color="#FF2C55" />
                <ButtonText className="text-base font-semibold text-[#FF2C55]">
                  Chia sẻ hồ sơ
                </ButtonText>
              </HStack>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-2 border-white/30 bg-transparent"
              onPress={handleBack}>
              <ButtonText className="text-base font-medium text-white">
                Đóng
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
