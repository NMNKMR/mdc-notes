import NoteCard from "@/components/notes/NoteCard";
import { notes } from "@/constants/data";
import { useTheme } from "@/context/theme";
import { useDebounce } from "@/hooks/useDebounce";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Notes = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const FADE_HEIGHT = 60;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filteredNotes = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((note) => note.title.toLowerCase().includes(q));
  }, [debouncedQuery]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: top },
          {
            backgroundColor: isDarkMode ? colors.background : "#fff8f4",
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable hitSlop={10}>
          <Ionicons name="menu" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.primary }]}>My Notes</Text>
        <View style={styles.toggleGroup}>
          <Ionicons
            name="sunny"
            size={18}
            color={isDarkMode ? colors.textSecondary : colors.primary}
          />
          <Switch
            value={isDarkMode}
            onValueChange={(value) => toggleTheme(value ? "dark" : "light")}
            trackColor={{ false: colors.primary, true: colors.primary }}
            thumbColor={colors.inputFill}
            ios_backgroundColor={colors.primary}
            style={{ transform: [{ scale: 1.1 }] }}
          />
          <Ionicons
            name="moon"
            size={18}
            color={isDarkMode ? colors.primary : colors.textSecondary}
          />
        </View>
      </View>
      {/* Notes List + Input Search */}
      <FlatList
        ListHeaderComponent={
          <View style={{ marginBottom: 24 }}>
            <View
              style={[styles.search, { backgroundColor: colors.inputFill }]}
            >
              <Ionicons name="search" size={24} color={colors.textPrimary} />
              <TextInput
                style={{ flex: 1, fontSize: 16, color: colors.textPrimary }}
                placeholder="Search your thoughts..."
                placeholderTextColor={colors.textSecondary}
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                autoCorrect={false}
              />
            </View>
          </View>
        }
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard {...item} />}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: FADE_HEIGHT + bottom - 20,
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        keyboardDismissMode="on-drag"
      />
      <LinearGradient
        pointerEvents="none"
        colors={["transparent", colors.background]}
        style={[styles.bottomFade, { height: FADE_HEIGHT + bottom }]}
      />
    </View>
  );
};

export default Notes;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 99,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  toggleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
