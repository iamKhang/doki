import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router/stack";
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
        <Stack screenOptions={{ headerShown: false, freezeOnBlur: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GluestackUIProvider>
    </Provider>
  );
}
