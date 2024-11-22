import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "@/global.css";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { Provider } from "react-redux";
import store from "@/store/store";

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
    <Provider store={store}>
      <GluestackUIProvider mode={"system"}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="post" options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
    </Provider>
  );
}
