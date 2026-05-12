# MDC Notes

A clean, minimal note-taking app for React Native (Expo). Two screens, a themable design system, and a small set of focused components — built as a Mobile Dev Cohort assignment.

## Features

- **Create, edit, and delete notes** with a confirmation prompt on delete.
- **Search** notes by title with a 300ms debounce so the list only re-filters once you stop typing.
- **Light / dark theme** with three-way control (light, dark, system). Toggle from the header switch, flanked by sun/moon icons that brighten based on the active mode.
- **Per-screen status bar control** — the editor's image header forces a light status bar while the list screen follows the theme.
- **Responsive layout** — single-column list on phones, two-column grid on tablets (≥768px), with screen padding that scales 16px → 32px.
- **Keyboard-aware editor** — body input stays above the keyboard via `KeyboardAvoidingView`, and tapping anywhere outside an input dismisses it.
- **Bottom fade gradient** on the list so cards visually trail off above the system nav buttons instead of crashing into them.

## Tech stack

- [Expo SDK 54](https://docs.expo.dev/) with [expo-router](https://docs.expo.dev/router/introduction/) for file-based routing
- React Native 0.81, React 19
- TypeScript
- [`expo-linear-gradient`](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) — bottom fade on the list
- [`expo-status-bar`](https://docs.expo.dev/versions/latest/sdk/status-bar/) — imperative status bar style
- [`@expo/vector-icons`](https://icons.expo.fyi/) (Ionicons) — all iconography
- [`date-fns`](https://date-fns.org/) — date formatting
- [`react-native-safe-area-context`](https://github.com/AppAndFlow/react-native-safe-area-context) — safe-area insets

## Project structure

```
mdc-notes/
├── app/
│   ├── _layout.tsx          # Root layout: ThemeProvider + Stack + status bar
│   └── index.tsx            # Notes list screen (search, FAB, grid/list, theme toggle)
├── components/
│   ├── ThemeProvider.tsx    # Owns isDarkMode + manual override; provides colors via context
│   ├── ThemedStatusBar.tsx  # Drives status bar style imperatively from theme
│   └── notes/
│       ├── NoteCard.tsx     # Single note card in the list, with inline delete
│       └── NoteForm.tsx     # Full-screen editor sheet for add/edit, with delete
├── constants/
│   ├── colors.ts            # lightColors + darkColors palettes, shared tokens
│   └── data.ts              # Seed Note[] used until persistence is added
├── context/
│   └── theme.ts             # ThemeContext + useTheme hook + ThemeColors type
├── hooks/
│   └── useDebounce.ts       # Generic debounce hook used for search
├── assets/                  # Image + icon assets shipped with the app
└── types.d.ts               # Global types: Note, ThemeMode
```

## Walkthrough

### Screen 1 — Notes List (`app/index.tsx`)

The list screen is the only route. It owns the notes array (`useState(defaultNotes)`), the search query, and the editor visibility state. From top to bottom:

1. **Header** — menu icon, "My Notes" title, and the theme toggle (`Switch` + sun/moon icons).
2. **Search bar** (rendered as the FlatList's `ListHeaderComponent`) — controlled `TextInput` whose value debounces through `useDebounce` before driving `useMemo`-cached filtering.
3. **FlatList** — renders `NoteCard`s. On tablets, switches to `numColumns={2}` with a `columnWrapperStyle` gap. The `key` prop flips between `"grid"` and `"list"` so FlatList remounts when the breakpoint crosses.
4. **Bottom fade** — `LinearGradient` (transparent → background) absolutely positioned at the bottom, height = `FADE_HEIGHT + bottomInset`. `pointerEvents="none"` so it doesn't block scrolling under it.
5. **Floating action button** — circular Pressable that opens `NoteForm` in `"add"` mode.
6. **NoteForm overlay** — conditionally rendered as a full-screen absolutely-positioned overlay when `showNoteForm !== null`.

Note CRUD lives in the screen itself:

- `addNote(note)` prepends with a generated id.
- `updateNote(id, note)` maps over the array.
- `deleteNote(id)` wraps the actual mutation in `Alert.alert` with a destructive Delete option — and closes the editor on confirm so children don't have to duplicate that logic.

### Screen 2 — Note Editor (`components/notes/NoteForm.tsx`)

Conditionally rendered overlay (not a route). Layout:

1. **Image header** (~30% of screen height) with a dark overlay, a back button on the left, and a Save (plus Delete in edit mode) group on the right.
2. **Form sheet** (`flex: 1`, `marginTop: -36` to overlap the image's bottom edge with rounded top corners) containing:
   - Title `TextInput`
   - "Created …" metadata row (edit mode only, formatted with `date-fns`)
   - Hairline divider
   - Body `TextInput` (`flex: 1`, `multiline`, `textAlignVertical="top"`)
3. Wrapped in a `KeyboardAvoidingView` so the sheet shrinks above the keyboard instead of the body being hidden under it.
4. Wrapped in a `Pressable` with `onPress={Keyboard.dismiss}` so taps anywhere except the inputs and buttons dismiss the keyboard.

The editor forces the status bar to `"light"` on mount and restores it to the theme-appropriate style on unmount via `useEffect` + `setStatusBarStyle`. Save dispatches to `addNote` or `updateNote` based on `mode`; Delete delegates to the parent's `deleteNote` (which handles its own confirmation).

## Theme system

A single `useTheme()` hook exposes `{ colors, isDarkMode, mode, toggleTheme }`.

- **Palettes** live in [`constants/colors.ts`](constants/colors.ts). A private `sharedColors` object holds tokens that don't change between modes (`onPrimary: "#FFFFFF"`). `lightColors` and `darkColors` spread `sharedColors` and add their own surfaces, text colors, and accents. `darkColors` is typed `as typeof lightColors` so the two palettes are guaranteed to stay in shape-sync.
- **`ThemeProvider`** ([`components/ThemeProvider.tsx`](components/ThemeProvider.tsx)) reads `useColorScheme()` for the system preference and keeps a local `mode` state (`"system" | "light" | "dark"`) so the user can override.
- **`ThemedStatusBar`** ([`components/ThemedStatusBar.tsx`](components/ThemedStatusBar.tsx)) is rendered once in `_layout.tsx`. It calls `setStatusBarStyle` imperatively in a `useEffect` keyed on `isDarkMode` — using the imperative API rather than `<StatusBar style={...} />` avoids a brief flicker we hit when toggling themes inside a Stack navigator.

Semantic tokens used throughout: `background`, `surface`, `inputFill`, `textPrimary`, `textSecondary`, `primary` (theme-specific brand), `onPrimary`, `border`, `shadow`.

## Hooks

| Hook                                            | Where                                            | What                                                                                         |
| ----------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `useTheme`                                      | `context/theme.ts`                               | Returns `{ colors, isDarkMode, mode, toggleTheme }`. Throws if used outside `ThemeProvider`. |
| `useDebounce<T>(value, delay)`                  | `hooks/useDebounce.ts`                           | Generic debounce. Used to delay the search filter until the user stops typing for 300ms.     |
| `useWindowDimensions` (RN built-in)             | `app/index.tsx`, `components/notes/NoteForm.tsx` | Drives the tablet breakpoint and the editor's image-header height.                           |
| `useSafeAreaInsets`                             | `app/index.tsx`, `components/notes/NoteForm.tsx` | Top inset for the header, bottom inset for the FAB-area fade.                                |
| `useColorScheme` (RN built-in)                  | `components/ThemeProvider.tsx`                   | System light/dark preference, used when the user hasn't manually overridden.                 |
| `useEffect` / `useState` / `useMemo` / `useRef` | Throughout                                       | Standard. `useMemo` caches `filteredNotes`; `useEffect` handles status bar side-effects.     |

## Notable patterns

- **`StyleSheet.compose`** in [`NoteCard.tsx`](components/notes/NoteCard.tsx) merges the static card style with per-render theme colors into a single style object (cast to `ViewStyle` because RN's `compose` returns a union of style kinds).
- **Confirmation lifted to parent** — `Alert.alert` for delete lives on the list screen, not in `NoteCard` or `NoteForm`. Children call `onDelete(id)` and let the parent confirm + close the editor.
- **Status bar override on a non-route screen** — since `NoteForm` is an overlay, not a navigation route, `useFocusEffect` doesn't apply. A plain `useEffect` with a cleanup that restores to the theme is enough.
- **Tap-outside dismiss** — wrapping the entire `NoteForm` in a `Pressable` with `Keyboard.dismiss` works because RN's responder system hands the touch to the deepest interactive child first; text inputs and buttons keep working while empty regions dismiss.

## Get started

```bash
npm install
npx expo start
```

Then pick your target from the Metro output:

- iOS simulator (press `i`)
- Android emulator (press `a`)
- Expo Go on a physical device (scan the QR code)
- Web (press `w`)

## What's not in here (yet)

- Persistence — notes live in component state and reset on reload. AsyncStorage or a small SQLite store is the natural next step.
- Note tags — the design has them but they're explicitly out of scope for this iteration.
- Sharing / export.
- Per-note cover images.
