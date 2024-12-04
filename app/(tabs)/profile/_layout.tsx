import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="me" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="share" />
    </Stack>
  );
}
