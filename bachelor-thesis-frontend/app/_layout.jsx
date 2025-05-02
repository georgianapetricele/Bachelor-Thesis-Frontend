import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  useFonts({
    lexend: require("../assets/fonts/Lexend-VariableFont_wght.ttf"),
  });
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
    
  );
}
