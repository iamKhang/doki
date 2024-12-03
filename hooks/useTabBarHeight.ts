import { Platform } from "react-native";

export function useTabBarHeight() {
  const baseHeight = 60; // Base height of tab bar
  const iosExtraHeight = Platform.OS === "ios" ? 24 : 0; // Extra height for iOS safe area
  return baseHeight + iosExtraHeight;
}
