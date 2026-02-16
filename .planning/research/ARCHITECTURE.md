# Architecture Research: Dark UI Theme System

**Project:** FlashText (React Native + Expo 51)
**Research Date:** 2026-02-16
**Domain:** Dark theme redesign for React Native app with animations
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    Application Root (AppLoader)                  │
├──────────────────────────────────────────────────────────────────┤
│                    ThemeProvider (React Context)                  │
│    Manages: theme state, toggles, system detection, persistence  │
├──────────────────────────────────────────────────────────────────┤
│                  PaperProvider (react-native-paper)              │
│        Wraps Paper components, enforces design consistency       │
├──────────────────────────────────────────────────────────────────┤
│                       Main Navigation                             │
├───────┬──────────────┬─────────────────┬──────────────┬──────────┤
│ Screens │ Components │ Values/Tokens │ Utils      │ Styles   │
├───────┼──────────────┼─────────────────┼──────────────┼──────────┤
│       │              │                 │              │          │
│ Main  │ GridButtons  │ THEME.js        │ useTheme()  │ Hooks    │
│ Flash │ InputBox     │ COLORS.js       │ getColors() │ useMemo  │
│ Options │ PreviewWin │ Typography.js   │ themeHook() │ useStyle │
│       │ FlashMessage │ Shadows.js      │             │          │
│       │ MyButton     │ Spacing.js      │             │          │
│       │ FontSelector │ Elevation.js    │             │          │
│       │              │                 │             │          │
└───────┴──────────────┴─────────────────┴──────────────┴──────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **ThemeProvider (Context)** | Central theme state, system detection (Appearance API), persistence via AsyncStorage, toggle function | Custom context + useContext hook |
| **PaperProvider** | Bridges custom theme to Paper library components, ensures design token consistency | Wraps entire app, receives theme object |
| **Screen Components** (Main, FlashScreen, Options) | Consume theme via useTheme hook, pass colors to child components | useTheme() → extract colors → pass as props |
| **UI Components** (GridButtons, InputBox, PreviewWindow) | Render with theme-aware colors, dispatch theme via props or hooks | useTheme() for direct access, props for parent override |
| **Animated Components** (FlashMessage, TextTransition) | Animate between colors using react-native-reanimated, maintain animation logic independent of theme | useSharedValue + useAnimatedStyle, color values injected |
| **Values/Tokens** (COLORS.js, THEME.js) | Define light/dark color palettes, semantic tokens, Paper-compatible structure | Plain JS objects, no state |

## Recommended Project Structure

```
src/
├── theme/                      # Theme system (NEW)
│   ├── ThemeContext.js        # React Context definition & provider
│   ├── useTheme.js            # Custom hook for accessing theme
│   ├── themes/                # Theme definitions
│   │   ├── light.js           # Light theme object (Paper format)
│   │   ├── dark.js            # Dark theme object (Paper format)
│   │   └── tokens.js          # Shared tokens (colors, spacing, etc)
│   └── hooks/
│       ├── useThemedStyles.js # Memoized style generator
│       └── useAnimatedTheme.js # For reanimated transitions
│
├── screens/
│   ├── Main.jsx              # Updated to use ThemeProvider
│   ├── FlashScreen.jsx       # Theme-aware flash animations
│   ├── Options.jsx           # Theme selector UI (NEW)
│   └── ScrollMessage.jsx
│
├── components/
│   ├── GridButtons.jsx       # Theme-aware button styles
│   ├── InputBox.jsx          # Theme-aware input styling
│   ├── PreviewWindow.jsx     # Theme-aware preview
│   ├── FlashMessage.jsx      # Animated colors with reanimated
│   ├── MyButton.jsx          # Semantic button component
│   ├── FontSelector.jsx
│   └── TextTransition.jsx
│
├── utils/
│   ├── screenDimensions.js   # Existing
│   └── themeHelpers.js       # NEW - utility functions
│
├── values/
│   ├── COLORS.js             # MIGRATING to theme/tokens
│   ├── fontScalingFactors.js
│   └── THEME.js              # NEW - Paper-compatible themes
│
└── values/AppLoader.jsx      # Wraps with ThemeProvider
```

### Structure Rationale

- **`theme/` folder:** Centralizes all theme logic, separate from business logic. Clear separation of concerns. Makes theme system testable and reusable.
- **`ThemeContext.js`:** Single source of truth for theme state. Handles system detection, persistence, and manual toggles.
- **`hooks/` subfolder:** Custom hooks keep theme consumption clean. `useThemedStyles` prevents unnecessary re-renders via useMemo.
- **`values/THEME.js`:** Material Design 3-compatible theme objects that react-native-paper expects. Mirrors Paper's color structure (primary, secondary, tertiary, surface, error, etc).
- **`AppLoader.jsx`:** Already loads fonts; wrap with ThemeProvider here to ensure theme is available to entire app.

## Architectural Patterns

### Pattern 1: Context-Based Theme Provider

**What:** A React Context that holds theme state (light/dark), system preference detection, persistence, and a toggle function. All components access theme via `useContext(ThemeContext)`.

**When to use:** Essential for global theme management. Use when app needs to:
- Detect system color scheme
- Allow user override
- Persist preference across restarts
- Update all components on theme change

**Trade-offs:**
- **Pros:** Minimal dependencies, uses native React APIs, easy to debug, works well with Reanimated.
- **Cons:** Requires explicit Context setup, components must subscribe to changes, doesn't prevent unnecessary renders without useMemo.

**Example:**
```typescript
// theme/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved preference
    AsyncStorage.getItem('themePreference').then((saved) => {
      if (saved) {
        setIsDark(saved === 'dark');
      } else {
        // Fall back to system
        const system = Appearance.getColorScheme() === 'dark';
        setIsDark(system);
      }
      setIsLoading(false);
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    await AsyncStorage.setItem('themePreference', newTheme);
  };

  if (isLoading) return null;

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Pattern 2: Paper-Compatible Theme Objects

**What:** Theme objects structured exactly as react-native-paper expects: `{ dark, mode, colors, fonts, roundness, animation }`. Ensures Paper components automatically inherit theme colors.

**When to use:** Mandatory when using react-native-paper. Provides:
- Semantic color tokens (primary, secondary, tertiary, surface, error, etc.)
- Material Design 3 compliance
- Automatic Paper component theming
- Clean, self-documenting color system

**Trade-offs:**
- **Pros:** Paper components theme automatically, Material Design standard, supports adaptive vs exact dark modes.
- **Cons:** Verbose color object structure, need both light and dark definitions, limited to Paper's color roles.

**Example:**
```typescript
// theme/themes/dark.js
export const darkTheme = {
  dark: true,
  mode: 'adaptive', // or 'exact' for different dark behavior
  roundness: 12,
  colors: {
    primary: '#BB86FC',
    onPrimary: '#371E55',
    primaryContainer: '#4F378A',
    onPrimaryContainer: '#EADDFF',

    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#7A6F87',
    onSecondaryContainer: '#FFFFFF',

    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#99476A',
    onTertiaryContainer: '#FFD8E4',

    background: '#1C1B1F',
    onBackground: '#E6E1E5',

    surface: '#1C1B1F',
    onSurface: '#E6E1E5',
    surfaceVariant: '#49454E',
    onSurfaceVariant: '#CAC7D0',

    error: '#F2B8B5',
    onError: '#601410',
    errorContainer: '#8C1D18',
    onErrorContainer: '#F9DEDC',

    outline: '#938F96',
    shadow: '#000000',
    inverseSurface: '#E6E1E5',
    inverseOnSurface: '#313033',
    inversePrimary: '#6750A4',
  },
  fonts: {
    // Paper font config
  },
};
```

### Pattern 3: useThemedStyles Hook with useMemo

**What:** A custom hook that takes a style generator function and returns memoized styles. Prevents creating new style objects on every render, critical for performance.

**When to use:** In components with frequent re-renders or complex style calculations. Prevents unnecessary native bridge calls.

**Trade-offs:**
- **Pros:** Performance optimization, clean component code, styles only recalculate when theme changes.
- **Cons:** Adds mental overhead, requires understanding useMemo, dependency array mistakes cause stale styles.

**Example:**
```typescript
// theme/hooks/useThemedStyles.js
import { useMemo } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

export const useThemedStyles = (styleGenerator) => {
  const { theme } = useContext(ThemeContext);

  return useMemo(
    () => styleGenerator(theme),
    [theme] // Only recalculate when theme changes
  );
};

// Usage in component:
const MyComponent = () => {
  const styles = useThemedStyles((theme) => ({
    container: {
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    text: {
      color: theme.colors.onBackground,
      fontSize: 14,
    },
  }));

  return <View style={styles.container}><Text style={styles.text}>Hello</Text></View>;
};
```

### Pattern 4: Animated Color Transitions with Reanimated

**What:** Use react-native-reanimated's `interpolateColor` to smoothly animate between light/dark theme colors instead of instant switches.

**When to use:** For polished UX, especially in FlashText where animations are critical. Animates individual colors or entire color schemes.

**Trade-offs:**
- **Pros:** Smooth visual transition, professional feel, works with Reanimated's existing animation system.
- **Cons:** Requires Reanimated 2+, adds complexity, interpolateColor needs paired input/output ranges.

**Example:**
```typescript
// Animates background color on theme toggle
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';

export const AnimatedThemeView = ({ children }) => {
  const { isDark, theme } = useContext(ThemeContext);
  const animationValue = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    animationValue.value = withTiming(isDark ? 1 : 0, {
      duration: 300,
    });
  }, [isDark]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [0, 1],
      [
        '#FFFFFF',  // light background
        '#1C1B1F',  // dark background
      ]
    );
    return { backgroundColor };
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};
```

## Data Flow

### Theme State Flow

```
System Color Scheme (Appearance API)
    ↓
ThemeContext (initial state)
    ↓
AsyncStorage (restore saved preference)
    ↓
Theme State (isDark boolean)
    ↓ (theme object provided)
PaperProvider (injects into Paper components)
Components (via useTheme hook)
    ↓
Render with theme colors
    ↓
Reanimated animations (optional color transitions)
```

### Component Consumption Flow

```
AppLoader (root)
    ↓
ThemeProvider (wraps app)
    ↓
PaperProvider (receives theme object)
    ↓
Screen (Main.jsx)
    ├─ useTheme() → extract colors
    ├─ useThemedStyles() → memoized styles
    ├─ GridButtons
    │  ├─ useTheme() → button colors
    │  └─ MyButton (receives color props)
    ├─ InputBox
    │  ├─ useTheme() → input colors
    │  └─ TextInput (styled inline)
    └─ PreviewWindow
       ├─ useTheme() → preview colors
       └─ FlashMessage (animated colors)
```

### Animation Color Flow (Special Case)

FlashMessage component currently uses hardcoded color arrays. For dark theme redesign:

```
Theme context (isDark state)
    ↓
useAnimatedTheme hook
    ↓
Shared Values (color arrays updated)
    ↓
useAnimatedStyle (interpolates colors)
    ↓
Animated.View/Text (renders animated colors)
```

Instead of:
```javascript
const availableColors = ['#FF0000', '#00FF00', ...]; // hardcoded
```

Use:
```javascript
const { theme } = useContext(ThemeContext);
const colorArray = useSharedValue(
  isDark ? theme.colors.darkAnimationPalette : theme.colors.lightAnimationPalette
);
```

## Component Boundaries

### Clear Boundaries (What Talks to What)

| Component | Can Access | Can Pass To |
|-----------|-----------|-------------|
| **ThemeProvider** | Appearance API, AsyncStorage | Provides theme context to entire tree |
| **PaperProvider** | Theme context | Provides Paper-scoped theme to Paper components |
| **Screen (Main)** | useTheme(), useContext(ThemeContext) | Passes theme colors as props to children |
| **UI Components** | Props or useTheme() hook | Pass color props to React Native primitives |
| **Animated Components** | useSharedValue(theme.colors.*) | Animated.View/Text for rendering |
| **Values/THEME.js** | No dependencies | Imported by ThemeProvider, consumed by components |

### What NOT to Do (Anti-Patterns)

1. **Don't pass theme through deeply nested prop drilling.** Use context hook instead.
2. **Don't recreate style objects in render.** Always use useMemo or StyleSheet.create for static styles.
3. **Don't switch themes by remounting components.** State change should update colors, not destroy/recreate components.
4. **Don't mix Paper's theme with custom inline styles inconsistently.** Use Paper components consistently or custom set for all.
5. **Don't hardcode colors in components.** Always extract from theme, never write `backgroundColor: '#1C1B1F'` directly.

## Build Order Implications

### Phase-Specific Build Sequence

**Phase 1: Theme Infrastructure**
- Create `theme/ThemeContext.js` with Appearance detection + AsyncStorage
- Define `theme/themes/light.js` and `theme/themes/dark.js` (Paper format)
- Create `theme/hooks/useTheme.js` and `useThemedStyles.js`
- Wrap AppLoader with ThemeProvider + PaperProvider
- **Blocker:** All other phases depend on this working

**Phase 2: Core Screen Themes**
- Update Main.jsx to use useTheme() instead of hardcoded COLORS.js
- Update FlashScreen.jsx colors to consume theme
- Update Options.jsx (new Options screen for theme selector)
- **Dependency:** Requires Phase 1

**Phase 3: Component Theming**
- GridButtons.jsx → useThemedStyles for button colors
- InputBox.jsx → themed input styling
- PreviewWindow.jsx → themed preview colors
- MyButton.jsx → semantic button component
- **Dependency:** Requires Phase 2

**Phase 4: Animation Integration**
- Update FlashMessage.jsx to animate between theme color palettes
- Update TextTransition.jsx for theme-aware animations
- Implement smooth color transitions with reanimated
- **Dependency:** Requires Phase 3

**Phase 5: Polish & Optimization**
- Test theme toggle across all screens
- Optimize useMemo dependencies
- Add theme transition animations to full-screen changes
- Profile performance with theme switching

### Critical Path Dependencies

```
Theme Infrastructure (Phase 1)
    ↓ (blocks everything)
Screen Themes (Phase 2)
    ├→ Component Theming (Phase 3)
    │  ↓ (blocks animations)
    └→ Animation Integration (Phase 4)
         ↓
Polish & Optimization (Phase 5)
```

Do **NOT** start Phase 2 until Phase 1 is fully functional. Attempting to theme components without ThemeProvider in place will cause runtime errors.

## Styling Strategy: StyleSheet vs Inline

### Recommendation: Hybrid Approach

**Use StyleSheet.create() for:**
- Static styles (padding, border-radius, fonts)
- Styles that never change based on theme
- Performance-critical, frequently-rendered components

**Use inline/dynamic styles for:**
- Theme-dependent colors
- Conditional styles based on state
- Styles calculated at render time (rare in RN)

**Example:**
```typescript
// In a component using the hybrid approach:
const staticStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    // No colors here
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    // No colors here
  },
});

const MyComponent = () => {
  const { theme } = useContext(ThemeContext);

  // Inline theme colors only
  const dynamicStyles = {
    container: {
      backgroundColor: theme.colors.surface,
    },
    text: {
      color: theme.colors.onSurface,
    },
  };

  return (
    <View style={[staticStyles.container, dynamicStyles.container]}>
      <Text style={[staticStyles.text, dynamicStyles.text]}>Hello</Text>
    </View>
  );
};
```

### Why This Works

- **Performance:** Static styles avoid recalculation
- **Theme responsiveness:** Dynamic colors update immediately on theme change
- **Readability:** Clear separation of static vs dynamic
- **Maintenance:** Theme-related changes in one place (theme object)

## Scalability Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users (current) | Context API + PaperProvider sufficient. No optimization needed. |
| 1k-100k users | Profile theme switching. Ensure useMemo in frequently-rendered components. Consider moving animation colors to Reanimated worklets. |
| 100k+ users | Potential: Split theme into multiple contexts by feature (colors, typography, spacing) if memory pressure appears. Profile Animation component re-renders. |

### Scaling Priorities

1. **First potential bottleneck:** Flash animation color recalculations on theme change. Mitigation: Use useSharedValue for animation color palettes, not useState.
2. **Second potential bottleneck:** Deep component trees with theme dependency re-rendering. Mitigation: useMemo in every component accessing theme, split themes by feature if needed.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Bypassing Context for Prop Drilling

**What people do:**
```javascript
// WRONG - passing theme 10+ levels deep
<Main theme={theme}>
  <GridButtons theme={theme}>
    <MyButton theme={theme}>
      <Text color={theme.colors.primary} />
```

**Why it's wrong:** Breaks encapsulation, makes refactoring painful, clutters prop lists, hard to track theme changes.

**Do this instead:**
```javascript
// CORRECT - use context everywhere
const MyButton = () => {
  const { theme } = useContext(ThemeContext);
  return <Text color={theme.colors.primary} />;
};
```

### Anti-Pattern 2: Creating Style Objects in Render

**What people do:**
```javascript
// WRONG - creates new object every render
const MyComponent = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* ... */}
    </View>
  );
};
```

**Why it's wrong:** Native bridge overhead, unnecessary re-renders, slower theme switches.

**Do this instead:**
```javascript
// CORRECT - memoized style generator
const MyComponent = () => {
  const styles = useThemedStyles((theme) => ({
    container: { backgroundColor: theme.colors.background },
  }));
  return <View style={styles.container}>{/* ... */}</View>;
};
```

### Anti-Pattern 3: Hardcoding Colors in Components

**What people do:**
```javascript
// WRONG - colors scattered everywhere
<View style={{ backgroundColor: '#1C1B1F' }}>
  <Text style={{ color: '#E6E1E5' }}>Text</Text>
</View>
```

**Why it's wrong:** Theme changes don't affect hardcoded colors, inconsistent design, impossible to audit what uses which colors.

**Do this instead:**
```javascript
// CORRECT - all colors from theme
const { theme } = useContext(ThemeContext);
<View style={{ backgroundColor: theme.colors.background }}>
  <Text style={{ color: theme.colors.onBackground }}>Text</Text>
</View>
```

### Anti-Pattern 4: Mixing Theme Approaches Inconsistently

**What people do:**
```javascript
// WRONG - some Paper components, some custom, different theme patterns
<PaperButton> {/* Uses PaperProvider theme */}
<View style={{ backgroundColor: '#1C1B1F' }}> {/* Hardcoded, ignores theme */}
<CustomButton color={localColor} /> {/* Prop-based, ignores context */}
```

**Why it's wrong:** Inconsistent look and feel, hard to maintain, theme changes miss components.

**Do this instead:** Choose one pattern—either all Paper components OR all custom with consistent context consumption. Stick to it.

## Sources

- [React Native Appearance Module Documentation](https://reactnative.dev/docs/appearance) - System theme detection, official API
- [React Native Paper Theming Guide](http://oss.callstack.com/react-native-paper/docs/guides/theming/) - Material Design 3 theme structure, color roles
- [Expo Color Themes Documentation](https://docs.expo.dev/develop/user-interface/color-themes/) - Expo Router theme integration
- [React Native Reanimated Animations](https://docs.swmansion.com/react-native-reanimated/docs/1.x/transitions/) - Color interpolation for transitions
- [Dark Mode Implementation with Context API - OpenReplay Blog](https://blog.openreplay.com/control-dark-mode-in-react-native-with-the-context-api/) - Context + AsyncStorage pattern
- [Reactive Styles in React Native - Medium](https://medium.com/supercharges-mobile-product-guide/reactive-styles-in-react-native-79a41fbdc404) - Performance best practices
- [Theme Switching Optimization - Medium](https://jerrintkg.medium.com/theme-switching-in-react-native-e26eabac113e) - useMemo + StyleSheet strategy

---
*Architecture research for: Dark UI theme redesign in FlashText*
*Researched: February 16, 2026*
