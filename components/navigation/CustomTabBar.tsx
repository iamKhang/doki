import { View, Text, TouchableOpacity } from "react-native";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Button, ButtonText } from "../ui/button";
import { Plus } from "lucide-react-native";
import { Fragment } from "react";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabsRoutes = state.routes.filter((route) =>
    ["index", "search", "notification", "profile"].includes(route.name),
  );

  const CenterButton = (
    <View className="mt-1 flex items-center justify-start px-4">
      <Button key="center" className="rounded-lg bg-white" size="sm">
        <Plus color="#000" />
      </Button>
    </View>
  );
  return (
    <View className="flex-row gap-1 bg-black px-2 py-2">
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
            {index === 2 && CenterButton}
            <TouchableOpacity
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
                  color={isFocused ? "#fff" : "#888"}
                  size={24}
                />
              ) : null}
              <Text className={`${isFocused ? "text-white" : "text-[#888]"}`}>
                {typeof label === "function"
                  ? label({
                      focused: isFocused,
                      color: isFocused ? "#fff" : "#888",
                      position: "below-icon",
                      children: "",
                    })
                  : label}
              </Text>
            </TouchableOpacity>
          </Fragment>
        );
      })}
    </View>
  );
}
