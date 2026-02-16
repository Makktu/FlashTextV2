# Coding Conventions

**Analysis Date:** 2026-02-16

## Naming Patterns

**Files:**
- React components: PascalCase with `.jsx` extension (e.g., `MyButton.jsx`, `PreviewWindow.jsx`, `GridButtons.jsx`)
- Utility files: camelCase with `.js` extension (e.g., `screenDimensions.js`, `fontScalingFactors.js`)
- Constants/values: UPPERCASE_SNAKE_CASE or UPPERCASE (e.g., `COLORS.js`)
- Screens: PascalCase with Screen suffix (e.g., `FlashScreen.jsx`, `Main.jsx`)
- Component directories: Lowercase plural names (e.g., `components/`, `screens/`, `utils/`, `values/`)

**Functions:**
- Exported component functions: PascalCase (e.g., `function MyButton()`, `function FlashScreen()`)
- Internal utility functions: camelCase (e.g., `getFlashScreenDimensions()`, `getContrastingColor()`, `calculateFontSize()`)
- Event handlers: camelCase with "handle" or "on" prefix (e.g., `handleInput()`, `handleHistoryPress()`, `onPress()`)
- Getter functions: camelCase with "get" prefix (e.g., `getTextColor()`, `getBackgroundStyle()`, `getRandomGradient()`)
- Callback functions: camelCase with "Callback" suffix (e.g., `calculateTextSize`)

**Variables:**
- State variables: camelCase (e.g., `isLoaded`, `currentScreen`, `flashType`, `duration`)
- Props: camelCase (e.g., `children`, `whenPressed`, `userBgColor`, `randomizeBgColor`)
- Constants: camelCase for module-level constants (e.g., `plainBtnAnimSpeed`, `IPAD_MAX_BUTTON_SIZE`)
- Boolean flags: Prefix with "is" or "has" (e.g., `isLandscape`, `isPad`, `hasText`, `isKeyboardVisible`)
- Arrays: camelCase plural (e.g., `selectedItems`, `messageHistory`, `words`)
- Animated values: camelCase with "Anim" suffix (e.g., `fadeAnim`, `scaleAnim`, `moveAnim`, `pulseAnim`)

**Types:**
- No TypeScript types detected - project uses JavaScript/JSX only
- Object prop types are documented in function parameters via destructuring with default values

## Code Style

**Formatting:**
- No Prettier or ESLint configuration detected
- Observed formatting patterns:
  - 2-space indentation (consistent across all files)
  - Semicolons used consistently
  - Double quotes for strings (`"Content"`)
  - Single quotes for JSX attributes (e.g., `mode='contained'`)

**Linting:**
- No automated linting tool configured
- Manual code review patterns observed

## Import Organization

**Order:**
1. React and React Native core imports (e.g., `import React from 'react'`)
2. React Native components (e.g., `import { StyleSheet, View, Text } from 'react-native'`)
3. Third-party libraries and packages (e.g., `expo-*`, `react-native-paper`, `react-native-reanimated`)
4. Internal components and utilities (relative imports with `../`)
5. Asset imports (e.g., `require('../../assets/fonts/...')`)

**Path Aliases:**
- Not used; relative paths with `../` used throughout (e.g., `import COLORS from '../values/COLORS'`)

## Error Handling

**Patterns:**
- Try-catch blocks wrap async operations (e.g., in `Main.jsx` for orientation locking):
  ```javascript
  try {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  } catch (error) {
    console.error('Failed to lock orientation:', error);
  }
  ```
- Console error logging for caught exceptions (e.g., `console.error('Failed to lock orientation:', error)`)
- Alert dialogs for user-facing errors (e.g., `Alert.alert('No History', 'No history yet')`)
- Early returns for null/undefined validation (e.g., in `Main.jsx`: `if (!text) { alert('Enter some text first!'); return; }`)
- Safe value checks before using animated values (e.g., `isNaN()` checks in `PreviewWindow.jsx`)

## Logging

**Framework:** `console` (built-in React Native)

**Patterns:**
- Simple logging with `console.log()` for debug information:
  - Device detection: `console.log(isIPad ? 'IPAD!' : 'NOT IPAD!')`
  - Component state: `console.log(flashType)`
  - User interactions: `console.log(text)`
- Error logging with `console.error()` for exceptions:
  - `console.error('Failed to lock orientation:', error)`
  - Used in orientation change failures and other async operations

## Comments

**When to Comment:**
- Complex layout logic: Comments explain iPad landscape implementation challenges (see `Main.jsx` lines 491-518)
- Disabled code: Commented-out code blocks kept for reference (e.g., `COLORS.js` lines 1-14, `GridButtons.jsx` lines 17-18)
- Codeium-generated code marked with comment banner: `/*************  ✨ Codeium Command 🌟  **************/` (see `Main.jsx` line 91)

**JSDoc/TSDoc:**
- Not consistently used
- Some function comments exist (e.g., docstring in `Main.jsx` lines 151-157 for `startPressed()`)
- No formal JSDoc format observed

## Function Design

**Size:** Functions range from 10-300+ lines; larger functions like `Main.jsx` are component functions with complex state management

**Parameters:**
- Destructured object parameters for components (e.g., `function MyButton({ size, children, whenPressed })`)
- Direct parameters for utility functions (e.g., `function getContrastingColor(bgColor)`)
- Default parameters common (e.g., `message = ['no', 'message', 'was', 'passed']`)
- Render props or callback props passed as functions (e.g., `whenPressed`, `handleInput`, `onPress`)

**Return Values:**
- Components return JSX elements wrapped in View/TouchableOpacity containers
- Utility functions return calculated values (numbers, strings, objects, boolean)
- Async functions return Promises (orientation locking, splash screen operations)
- Early returns used for guard clauses (validation, null checks)

## Module Design

**Exports:**
- Default exports for components: `export default function ComponentName(...)`
- Named exports for utilities: `export const functionName = (...) => {}`
- Single export per file for components; utilities may have multiple exports
- Re-exports from values (e.g., `availableColors` imported and re-used across multiple components)

**Barrel Files:**
- Not used; direct imports from source files (e.g., `import COLORS from '../values/COLORS'`)
- Directory-based organization without index.js aggregation files

---

*Convention analysis: 2026-02-16*
