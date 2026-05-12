import { useTheme } from "@/context/theme";
import { format } from "date-fns";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const NoteCard = ({ title, content, updatedAt }: Note) => {
  const { colors } = useTheme();
  return (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
    >
      <View style={{ gap: 12 }}>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          style={[styles.content, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {content}
        </Text>
        <Text style={[styles.updatedAt, { color: colors.textSecondary }]}>
          {format(updatedAt, "MMM dd, yyyy")}
        </Text>
      </View>
    </Pressable>
  );
};

export default NoteCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  updatedAt: {
    fontSize: 12,
    marginTop: 8,
  },
});
