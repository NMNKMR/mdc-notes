import ThemedStatusBar from "@/components/ThemedStatusBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStatusBar />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
