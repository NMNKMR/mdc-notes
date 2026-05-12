import NoteCard from "@/components/notes/NoteCard";
import NoteForm from "@/components/notes/NoteForm";
import { notes as defaultNotes } from "@/constants/data";
import { useTheme } from "@/context/theme";
import { useDebounce } from "@/hooks/useDebounce";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FADE_HEIGHT = 60;

const Notes = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState(defaultNotes);
  const [showNoteForm, setShowNoteForm] = useState<{
    note: Note | null;
    mode: "add" | "edit";
  } | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  const filteredNotes = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((note) => note.title.toLowerCase().includes(q));
  }, [debouncedQuery, notes]);

  const addNote = (note: Omit<Note, "id">) =>
    setNotes((prev) => [{ ...note, id: Date.now().toString() }, ...prev]);
  const updateNote = (id: string, note: Note) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? note : n)));
  const deleteNote = (id: string) => {
    Alert.alert(
      "Delete note?",
      "This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotes((prev) => prev.filter((note) => note.id !== id));
            setShowNoteForm(null);
          },
        },
      ],
      { cancelable: true },
    );
  };

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
            accessibilityRole="switch"
            accessibilityLabel={isDarkMode ? "Dark Theme" : "Light Theme"}
            accessibilityHint="Toggles theme"
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
        key={isTablet ? "grid" : "list"}
        numColumns={isTablet ? 2 : 1}
        columnWrapperStyle={isTablet ? { gap: 16 } : undefined}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            onDelete={deleteNote}
            onPress={() => setShowNoteForm({ note: item, mode: "edit" })}
            {...item}
          />
        )}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: isTablet ? 32 : 16,
          paddingTop: 24,
          paddingBottom: FADE_HEIGHT + bottom,
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
      <Pressable
        style={[
          styles.addBtn,
          { backgroundColor: colors.primary, shadowColor: colors.primary },
        ]}
        onPress={() => setShowNoteForm({ note: null, mode: "add" })}
        hitSlop={10}
      >
        <Ionicons name="add" size={24} color={colors.onPrimary} />
      </Pressable>
      {showNoteForm !== null && (
        <NoteForm
          addNote={addNote}
          updateNote={updateNote}
          deleteNote={deleteNote}
          note={showNoteForm.note}
          mode={showNoteForm.mode}
          onClose={() => setShowNoteForm(null)}
        />
      )}
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
  addBtn: {
    position: "absolute",
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
  },
});
