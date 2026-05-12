import { useTheme } from "@/context/theme";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

type NoteCardPropType = {
  onDelete: (id: string) => void;
  onPress: () => void;
} & Note;

const NoteCard = ({
  title,
  content,
  updatedAt,
  id,
  onPress,
  onDelete,
}: NoteCardPropType) => {
  const { colors } = useTheme();

  const cardStyle = StyleSheet.compose(styles.card, {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
  }) as ViewStyle;

  return (
    <Pressable onPress={onPress} style={cardStyle}>
      <View style={{ gap: 12, paddingRight: 32 }}>
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
      <Pressable
        onPress={() => onDelete(id)}
        hitSlop={8}
        style={styles.deleteBtn}
      >
        <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
      </Pressable>
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
  deleteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
    borderRadius: 99,
  },
});
