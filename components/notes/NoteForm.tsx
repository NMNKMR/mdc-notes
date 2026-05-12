import { useTheme } from "@/context/theme";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { setStatusBarStyle } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NoteFormPropType = {
  addNote: (note: Omit<Note, "id">) => void;
  updateNote: (id: string, note: Note) => void;
  deleteNote: (id: string) => void;
  note: Note | null;
  mode: "add" | "edit";
  onClose: () => void;
};

const NoteForm = ({
  addNote,
  updateNote,
  deleteNote,
  note,
  mode,
  onClose,
}: NoteFormPropType) => {
  const { colors, isDarkMode } = useTheme();
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    setStatusBarStyle("light");
    return () => {
      setStatusBarStyle(isDarkMode ? "light" : "dark");
    };
  }, [isDarkMode]);

  const handleSave = () => {
    const now = new Date().toISOString();
    if (mode === "edit" && note) {
      updateNote(note.id, {
        ...note,
        title,
        content,
        updatedAt: now,
      });
    } else {
      addNote({
        title,
        content,
        createdAt: now,
        updatedAt: now,
      });
    }
    onClose();
  };

  return (
    <Pressable style={formStyles.container} onPress={Keyboard.dismiss}>
      {/* BG Image Header */}
      <ImageBackground
        style={{ height: height * 0.3 }}
        source={require("@/assets/images/note-bg.png")}
      >
        <View style={[formStyles.bgOverlay, { paddingTop: top + 8 }]}>
          <View style={formStyles.bgOverlayActions}>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={[formStyles.overlayBtn, formStyles.back]}
            >
              <Ionicons name="arrow-back" size={24} color={colors.onPrimary} />
            </Pressable>
            <View style={formStyles.rightActions}>
              {mode === "edit" && note && (
                <Pressable
                  onPress={() => deleteNote(note.id)}
                  hitSlop={10}
                  style={[formStyles.overlayBtn, formStyles.delete]}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.onPrimary}
                  />
                </Pressable>
              )}
              <Pressable
                style={[
                  formStyles.overlayBtn,
                  formStyles.save,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleSave}
                hitSlop={10}
              >
                <Text style={{ color: colors.onPrimary, fontSize: 16 }}>
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
      {/* Note Form */}
      <KeyboardAvoidingView
        behavior={"padding"}
        style={[
          formStyles.form,
          { backgroundColor: isDarkMode ? colors.background : "#fff8f4" },
        ]}
      >
        <TextInput
          placeholder="Note Title"
          placeholderTextColor={"#aba096"}
          value={title}
          onChangeText={setTitle}
          style={[formStyles.titleInput, { color: colors.textPrimary }]}
          multiline
        />
        {mode === "edit" && note && (
          <View style={formStyles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              style={[formStyles.metaText, { color: colors.textSecondary }]}
            >
              Created {format(new Date(note.createdAt), "MMM d, yyyy")} ·{" "}
              {format(new Date(note.createdAt), "h:mm a")}
            </Text>
          </View>
        )}
        <View
          style={[formStyles.divider, { backgroundColor: colors.border }]}
        />
        <TextInput
          placeholder="Start typing your thoughts here..."
          placeholderTextColor={colors.textSecondary}
          value={content}
          onChangeText={setContent}
          style={[formStyles.bodyInput, { color: colors.textPrimary }]}
          multiline
          textAlignVertical="top"
        />
      </KeyboardAvoidingView>
    </Pressable>
  );
};

export default NoteForm;

const formStyles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bgOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 16,
  },
  bgOverlayActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  overlayBtn: {
    borderRadius: 99,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    justifyContent: "center",
    alignItems: "center",
  },
  back: {
    backgroundColor: "#423b35",
    padding: 8,
  },
  delete: {
    backgroundColor: "#423b35",
    padding: 8,
  },
  save: {
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  form: {
    flex: 1,
    marginTop: -36,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopStartRadius: 36,
    borderTopEndRadius: 36,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: "700",
    padding: 0,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  metaText: {
    fontSize: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 16,
    marginBottom: 16,
  },
  bodyInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
  },
});
