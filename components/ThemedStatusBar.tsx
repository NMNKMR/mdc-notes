import { useTheme } from "@/context/theme";
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect } from "react";

const ThemedStatusBar = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setStatusBarStyle(isDarkMode ? "light" : "dark");
  }, [isDarkMode]);

  return null;
};

export default ThemedStatusBar;
