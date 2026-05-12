import { darkColors, lightColors } from "@/constants/colors";
import { ThemeContext } from "@/context/theme";
import { ReactNode, useState } from "react";
import { useColorScheme } from "react-native";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const toggleTheme = (next: ThemeMode) => setMode(next);

  const isDarkMode =
    mode === "system" ? systemColorScheme === "dark" : mode === "dark";
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
