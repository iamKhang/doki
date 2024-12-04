import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Button } from "../ui/button";
import { Plus } from "lucide-react-native";
import { Fragment } from "react";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import clsx from "clsx";
import { Platform, View } from "react-native";
import { Link, usePathname } from "expo-router";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const pathname = usePathname();
  const tabBarHeight = useTabBarHeight();

  const tabsRoutes = state.routes.filter((route) =>
    ["index", "search", "notification", "profile"].includes(route.name),
  );

  const middleIndex = Math.floor(tabsRoutes.length / 2);
  const isHome = pathname === "/" || pathname === "/index";

  const CenterButton = (
    <Box className="flex items-center justify-start px-4">
      <Link href="/post/new-post" asChild>
        <Button
          key="center"
          className={clsx(
            "h-10 w-10 rounded-lg active:opacity-80",
            isHome ? "bg-white" : "bg-black",
          )}
          size="sm">
          <Plus
            strokeWidth={2}
            color={isHome ? "#000" : "#fff"}
            style={{
              width: Platform.OS === "web" ? 24 : 28,
              height: Platform.OS === "web" ? 20 : 24,
            }}
          />
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box
      className={clsx(
        "flex-row items-center gap-1 px-2 py-2",
        isHome ? "bg-black" : "bg-white",
        Platform.OS === "ios" && "pb-6",
      )}
      style={{
        height: tabBarHeight,
        borderTopWidth: 0.5,
        borderTopColor: "rgb(209, 213, 219)",
      }}>
      {tabsRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === "profile") {
              navigation.navigate("profile", { screen: "me" });
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        return (
          <Fragment key={index}>
            {index === middleIndex && CenterButton}
            <Pressable
              key={route.key}
              className={clsx("flex-1 items-center justify-center py-2")}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}>
              <View className="items-center">
                {typeof options.tabBarIcon === "function" ? (
                  <options.tabBarIcon
                    focused={isFocused}
                    color={isFocused ? (isHome ? "#fff" : "#000") : "#888"}
                    size={Platform.OS === "web" ? 20 : 24}
                  />
                ) : null}
                <Text
                  className={clsx(
                    "mt-1 text-xs",
                    isFocused
                      ? isHome
                        ? "text-white"
                        : "text-black"
                      : "text-gray-500",
                  )}>
                  {typeof label === "string" ? label : ""}
                </Text>
              </View>
            </Pressable>
          </Fragment>
        );
      })}
    </Box>
  );
}
