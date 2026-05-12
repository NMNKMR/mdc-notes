import { ThemeColors } from "@/constants/colors";
import { createContext, useContext } from "react";

interface ThemeContextType {
  colors: ThemeColors;
  isDarkMode: boolean;
  mode: ThemeMode; // Added mode to context for better control in components like three way switch case (future implementation)
  toggleTheme: (next: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
