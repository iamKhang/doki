import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Button } from "../ui/button";
import { Plus } from "lucide-react-native";
import { Fragment } from "react";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import clsx from "clsx";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabsRoutes = state.routes.filter((route) =>
    ["index", "search", "notification", "profile"].includes(route.name),
  );

  const middleIndex = Math.floor(tabsRoutes.length / 2);
  const isHome = state.index === 0;

  const CenterButton = (
    <Box className="mt-1 flex items-center justify-start px-4">
      <Button
        key="center"
        className={clsx(
          "rounded-lg bg-white",
          isHome ? "bg-white" : "bg-black",
        )}
        size="sm">
        <Plus strokeWidth={2} color={isHome ? "#000" : "#fff"} />
      </Button>
    </Box>
  );
  return (
    <Box
      className={clsx(
        "min-h-12 flex-row gap-1 border-t-[0.5px] border-t-gray-300 px-2 py-2",
        isHome ? "bg-black" : "bg-white",
      )}>
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
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Fragment key={index}>
            {index === middleIndex && CenterButton}
            <Pressable
              key={route.key}
              className="flex-1 items-center justify-center"
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}>
              {typeof options.tabBarIcon === "function" ? (
                <options.tabBarIcon
                  focused={isFocused}
                  color={isFocused ? (isHome ? "#fff" : "#000") : "#888"}
                  size={24}
                />
              ) : null}
              <Text
                className={clsx(
                  isFocused ? (isHome ? "#fff" : "#000") : "#888",
                )}>
                {typeof label === "function"
                  ? label({
                      focused: isFocused,
                      color: isFocused ? (isHome ? "#fff" : "#000") : "#888",
                      position: "below-icon",
                      children: "",
                    })
                  : label}
              </Text>
            </Pressable>
          </Fragment>
        );
      })}
    </Box>
  );
}
