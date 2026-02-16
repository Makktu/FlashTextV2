# Codebase Concerns

**Analysis Date:** 2026-02-16

## Tech Debt

**Large Components with Multiple Responsibilities:**
- Issue: Main screen component handles state management, orientation logic, keyboard detection, animation triggering, and UI rendering
- Files: `src/screens/Main.jsx` (697 lines)
- Impact: Difficult to test, maintain, and reuse individual features; changes to one concern risk breaking others
- Fix approach: Extract orientation management to custom hook, separate keyboard state into context, move animation trigger logic to PreviewWindow component

**Deprecated Grid Layout System:**
- Issue: GridButtons component uses inline responsive styling instead of consistent layout system
- Files: `src/components/GridButtons.jsx` (537 lines)
- Impact: Makes iPad-specific adjustments scattered throughout component, difficult to maintain layout consistency across devices
- Fix approach: Create centralized `layouts.js` with device-specific layout configurations; use `useResponsiveDimensions` hook to calculate styles consistently

**Duplicate Font Size Calculation Logic:**
- Issue: Font scaling logic appears in multiple components without shared utilities
- Files: `src/screens/subflash screens/FlashPlain.jsx` (lines 40-76), `src/screens/subflash screens/FlashSwoosh.jsx` (lines 72-108), `src/components/PreviewWindow.jsx` (lines 193-213)
- Impact: Changes to scaling algorithm require updates in 3+ places; inconsistent text sizing across animation types
- Fix approach: Create `calculateFlashFontSize.js` utility with shared logic and unit tests

**Hex Color Parsing Appears Multiple Times:**
- Issue: `getContrastingColor()` implemented in 2 places with slightly different logic
- Files: `src/components/FlashMessage.jsx` (lines 11-24), `src/screens/subflash screens/FlashPlain.jsx` (lines 13-20), `src/screens/subflash screens/FlashSwoosh.jsx` (lines 14-21)
- Impact: Inconsistent contrast calculation; bugs in one copy don't get fixed everywhere
- Fix approach: Create `src/utils/colorUtils.js` with shared `getContrastingColor()` and `getTextColorForBackground()` functions

## Known Bugs

**Subtitle Version Number Not Hidden on Flash Screen:**
- Symptoms: Version "2.0" text visible in top-right corner of Main screen doesn't update when switching to FlashScreen
- Files: `src/screens/Main.jsx` (line 351)
- Trigger: Navigate to any flash animation with text
- Workaround: Visual only; doesn't affect functionality

**Orientation Lock Race Condition:**
- Symptoms: Sometimes subtitle appears to cut off or layout is incorrect when rapidly switching between screens
- Files: `src/screens/FlashScreen.jsx` (lines 24-52), `src/screens/Main.jsx` (lines 176-189)
- Trigger: Quickly tap Start, then immediately tap back button on iPad in portrait mode
- Cause: Orientation change isn't fully complete before component renders; 50ms delay insufficient for all devices
- Workaround: Wait for device to fully reorient before interacting with UI

**Font Scaling Factor Comments Suggest Ongoing Adjustments:**
- Symptoms: Comments indicate "Increased" or "Reduced" values repeatedly
- Files: `src/screens/subflash screens/FlashPlain.jsx` (line 58), `src/screens/subflash screens/FlashSwoosh.jsx` (line 90)
- Impact: Suggests formula is being constantly tweaked; actual optimal values unclear
- Fix approach: Create test suite with various word lengths and fonts to establish stable baseline

**Preview Animation Stops After 2 Cycles:**
- Symptoms: PreviewWindow animation only runs twice then displays "Preview Complete" message
- Files: `src/components/PreviewWindow.jsx` (lines 85, 164-168)
- Trigger: Change font, observe that preview stops animating after 2 word cycles
- Cause: `previewCount` state intentionally limits animation to prevent distraction while typing; may need adjustment

## Security Considerations

**No Input Validation:**
- Risk: User text input passed directly to display without sanitization
- Files: `src/screens/Main.jsx` (line 171), `src/components/PreviewWindow.jsx` (line 53)
- Current mitigation: None; React Native's text rendering is inherently safer than web
- Recommendations: No action needed for React Native, but if web support added, implement input sanitization

**No Message History Persistence:**
- Risk: Message history stored in component state; lost on app restart
- Files: `src/screens/Main.jsx` (lines 35-39, 169)
- Current mitigation: Limited to 50 messages in memory
- Recommendations: Use AsyncStorage to persist history if desired; add UI warning that history is session-only

## Performance Bottlenecks

**Excessive Console Logging in Main Loop:**
- Problem: Multiple `console.log()` statements triggered during render and animation loops
- Files: `src/screens/Main.jsx` (lines 60, 65, 72), `src/components/GridButtons.jsx` (line 95), `src/screens/subflash screens/FlashPlain.jsx` (line 38), `src/screens/Options.jsx` (line 8)
- Cause: Debug statements not removed; triggered every orientation check and button press
- Improvement path: Create debug utility with conditional logging; remove or wrap with `__DEV__` checks

**Animation Values Using Callback Dependencies:**
- Problem: Multiple `useCallback()` hooks have long dependency arrays triggering re-renders
- Files: `src/components/GridButtons.jsx` (lines 60-162), `src/components/PreviewWindow.jsx` (lines 81-176)
- Cause: Animation functions depend on props and state changes
- Improvement path: Use `useMemo()` for computed values; consider moving animation logic to Worklet for native performance

**Dynamic Font Size Recalculation on Every Word:**
- Problem: `calculateFontSize()` recalculates for every word change instead of caching
- Files: `src/screens/subflash screens/FlashPlain.jsx` (lines 79-82), `src/screens/subflash screens/FlashSwoosh.jsx` - not shown but similar pattern
- Cause: Font size depends on word length, which changes per word
- Improvement path: Memoize results; cache font sizes for repeated words

**LinearGradient Re-renders with Color Changes:**
- Problem: Gradient animates on every word change in random color mode
- Files: `src/components/PreviewWindow.jsx` (lines 318-325)
- Cause: Color array generated fresh each render
- Improvement path: Memoize gradient colors; use `useMemo()` for `getRandomGradient()`

## Fragile Areas

**iPad Landscape Layout Management:**
- Files: `src/screens/Main.jsx` (lines 328-430, 684-697)
- Why fragile: Complex conditional rendering for landscape mode with negative margins and buffer views; unclear why specific values were chosen
- Safe modification: Before changing layout, document exact iPad model sizes tested; add layout verification tests
- Test coverage: No automated tests for layout on iPad devices

**Animated Value Type Coercion in PreviewWindow:**
- Files: `src/components/PreviewWindow.jsx` (lines 269-271)
- Why fragile: Manual checks for `isNaN()` on animated values suggest type safety issues
- Safe modification: Add comments explaining why this is necessary; consider extracting to shared utility
- Test coverage: No tests for edge cases with empty arrays or undefined animated values

**Message Word Splitting Logic:**
- Files: `src/screens/Main.jsx` (line 171), `src/components/PreviewWindow.jsx` (line 53)
- Why fragile: Uses `split(' ')` for Main, `split(/\s+/)` for PreviewWindow - inconsistent
- Safe modification: Create shared word-splitting utility; handle multiple spaces, tabs, newlines consistently
- Test coverage: No tests for edge cases (multiple spaces, leading/trailing spaces, special characters)

**Keyboard Visibility Detection:**
- Files: `src/screens/Main.jsx` (lines 125-143)
- Why fragile: Relies on keyboard events that may not fire consistently on all devices
- Safe modification: Add fallback timeout-based detection; test on multiple device/OS combinations
- Test coverage: No tests for keyboard event reliability

## Scaling Limits

**Message History Limited to 50 Entries:**
- Current capacity: 50 messages in memory
- Limit: Arbitrary; no performance testing done
- Scaling path: If unlimited history needed, migrate to persistent storage (AsyncStorage or SQLite); implement pagination

**Font Family List is Hard-Coded:**
- Current capacity: 10 fonts loaded from `availableFonts` array
- Limit: Adding fonts requires code change; fonts loaded synchronously at app startup
- Scaling path: Load fonts from configuration; implement lazy loading with font bundle splitting

**Color Palette Fixed to availableColors Array:**
- Current capacity: ~7 colors in `availableColors` array
- Limit: Changes require code modification
- Scaling path: Move to configuration file; allow custom color schemes through settings screen

**PreviewWindow Limited to ~50 Words:**
- Current capacity: Words split and previewed on-the-fly
- Limit: No explicit limit, but performance not tested with very long texts
- Scaling path: Implement virtualization for extremely long texts; add debouncing to preview updates

## Dependencies at Risk

**Expo Modules at Near-End-of-Life:**
- Risk: `expo-screen-orientation` (v7.0.5) and `expo-splash-screen` (v0.27.6) approaching deprecation
- Impact: May break when upgrading to newer Expo SDK versions
- Migration plan: Monitor Expo changelog; consider switching to `expo-screen-orientation@^8.0.0` in next major update

**React Native Version Lag:**
- Risk: Project uses React Native 0.74.5 while latest is 0.75+
- Impact: Missing bug fixes and performance improvements
- Migration plan: Schedule quarterly updates; test thoroughly on iOS and Android before deploying

**Reanimated Animation Completion Callback Unsafe:**
- Risk: `animationRef.current.start()` callback in PreviewWindow may not fire reliably
- Files: `src/components/PreviewWindow.jsx` (lines 158-169)
- Impact: Animation state can become inconsistent if callback doesn't fire
- Migration plan: Add timeout fallback; implement explicit state machine for animation lifecycle

## Missing Critical Features

**No Error Boundary:**
- Problem: App will crash if any component throws unhandled error
- Blocks: Production deployment; user experience during runtime errors
- Fix: Implement ErrorBoundary component using React error handling

**No Loading/Error States for Font Loading:**
- Problem: Fonts are required but no feedback if loading fails
- Blocks: Users won't know if custom fonts didn't load
- Fix: Add try-catch around font loading; display warning if fonts unavailable

**No Backup for Persistent State:**
- Problem: Message history lost on app force-close
- Blocks: Users expect history to persist across sessions
- Fix: Implement AsyncStorage persistence with recovery on app start

**No Accessibility Features:**
- Problem: No `accessibilityLabel`, `accessibilityHint`, or screen reader support
- Blocks: App not usable by visually impaired users
- Fix: Add accessibility props to all interactive elements; implement VoiceOver/TalkBack support

## Test Coverage Gaps

**Animation Synchronization Not Tested:**
- What's not tested: Synchronization between background color animation and text animation
- Files: `src/screens/subflash screens/FlashPlain.jsx`, `src/screens/subflash screens/FlashSwoosh.jsx`, `src/screens/subflash screens/FlashStretch.jsx`
- Risk: Animation timing mismatches could go unnoticed; affects perceived quality
- Priority: High

**Device-Specific Layout Rendering Not Tested:**
- What's not tested: UI appearance on various iPad sizes and orientations; responsiveness on different phone aspect ratios
- Files: `src/screens/Main.jsx`, `src/components/GridButtons.jsx`, `src/components/PreviewWindow.jsx`
- Risk: Layout breaks on untested device sizes; discovered only after user reports
- Priority: High

**Font Scaling Edge Cases Not Tested:**
- What's not tested: Single-letter words, very long words (50+ chars), words with special characters
- Files: `src/screens/subflash screens/FlashPlain.jsx`, `src/screens/subflash screens/FlashSwoosh.jsx`, `src/components/PreviewWindow.jsx`
- Risk: Text overflow, font size 0, layout breaks with edge case inputs
- Priority: Medium

**Keyboard Show/Hide Timing Not Tested:**
- What's not tested: PreviewWindow behavior when keyboard appears/disappears during animation
- Files: `src/components/PreviewWindow.jsx`, `src/screens/Main.jsx`
- Risk: Animation state inconsistency when keyboard interacts with preview
- Priority: Medium

**Cleanup on Component Unmount Not Verified:**
- What's not tested: Animations properly stopped, event listeners removed, memory leaked on navigation
- Files: `src/screens/subflash screens/FlashPlain.jsx`, `src/screens/subflash screens/FlashSwoosh.jsx`
- Risk: Memory leaks accumulate on repeated navigation; app slows down over time
- Priority: High

---

*Concerns audit: 2026-02-16*
