import CustomTabBar from "@/components/navigation/CustomTabBar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { House, MessageCircle, Search, UserRound } from "lucide-react-native";
import { useEffect } from "react";
import "@/global.css";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <GluestackUIProvider mode={"system"}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: (color) => (
              <House
                color={color.color}
                fill={color.color !== "#000" ? "none" : color.color}
                style={{ width: color.size, height: color.size }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: (color) => (
              <Search
                color={color.color}
                style={{ width: color.size, height: color.size }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="notification"
          options={{
            title: "Notification",
            tabBarIcon: (color) => (
              <MessageCircle
                color={color.color}
                fill={color.color !== "#000" ? "none" : color.color}
                style={{ width: color.size, height: color.size }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: (color) => (
              <UserRound
                color={color.color}
                fill={color.color !== "#000" ? "none" : color.color}
                style={{ width: color.size, height: color.size }}
              />
            ),
          }}
        />
      </Tabs>
    </GluestackUIProvider>
  );
}
