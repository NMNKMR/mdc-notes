const sharedColors = {
  onPrimary: "#FFFFFF",
} as const;

export const lightColors = {
  ...sharedColors,
  primary: "#855300",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  inputFill: "#EEEEEE",
  textPrimary: "#1A1A1A",
  textSecondary: "#888888",
  border: "rgba(0, 0, 0, 0.08)",
  shadow: "rgba(0, 0, 0, 0.08)",
};

export type ThemeColors = typeof lightColors;

export const darkColors: ThemeColors = {
  ...sharedColors,
  primary: "#F59E0B",
  background: "#121212",
  surface: "#2C2C2C",
  inputFill: "#2A2A2A",
  textPrimary: "#F0F0F0",
  textSecondary: "#AAAAAA",
  border: "rgba(255, 255, 255, 0.08)",
  shadow: "rgba(0, 0, 0, 0.4)",
};
