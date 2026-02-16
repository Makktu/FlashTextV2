# Domain Pitfalls: Dark UI Redesign for React Native

**Domain:** Dark mode/theme redesign for mobile apps with colored backgrounds and animated text display
**Researched:** 2026-02-16
**Confidence:** HIGH (verified with official React Native, react-native-paper docs + community sources + industry standards)

## Critical Pitfalls

### Pitfall 1: Contrast Failure on Colored Backgrounds

**What goes wrong:**
User-selected colored backgrounds (primary feature of FlashText) become unreadable with certain color combinations in dark theme. Text that was readable on bright backgrounds fails WCAG AA contrast (4.5:1 for normal text) on dark backgrounds. This is especially problematic since FlashText displays colored text on colored backgrounds—a compounding contrast problem.

**Why it happens:**
Developers assume contrast calculations remain constant across light and dark themes. They don't account for how color psychology differs: bright colors on dark backgrounds create "halation" (vibration effect) especially with saturated blues, reds, and greens. The human eye perceives contrast differently in dark mode. Highly saturated colors that look fine on light backgrounds vibrate and strain eyes on dark backgrounds.

**How to avoid:**
1. Use a contrast-checking matrix that tests every combination of selectable background colors against every text color in BOTH light and dark themes
2. Desaturate bright colors slightly in dark mode (e.g., #FF4500 becomes #FF6B35)
3. Implement automatic contrast detection: use luminance formulas (WCAG 2.0) to programmatically verify text meets 4.5:1 minimum. React Native packages like `tinycolor2` can calculate this at runtime
4. Test with actual ColorPicker UI inputs; don't rely on manual spot-checks
5. Provide automatic fallback: if selected color + background fail contrast, automatically adjust text color or background opacity

**Warning signs:**
- User complaints about readability on specific color combinations
- Screenshot feedback showing text blending into background
- Accessibility audit tools flagging contrast failures
- Specific color combinations always reported as hard to read

**Phase to address:**
Phase 1 (Visual Redesign) - must establish contrast validation system before converting UI. Phase 2 (Component Audit) - verify all user-facing color combinations pass contrast tests.

---

### Pitfall 2: Hard-Coded Colors in Inline StyleSheets

**What goes wrong:**
App uses inline `StyleSheet.create()` with hard-coded color values (#000000, #ffffff, etc.). When redesigning to dark theme, these become scattered throughout 50+ component files. Updating a color requires grep+replace across multiple files, introducing inconsistency. Some screens update, others don't. Components that share a color concept drift apart.

**Why it happens:**
Inline StyleSheets feel convenient—they're co-located with component logic. Hard-coded colors are faster to write than importing a theme system. Developers don't anticipate needing to change colors globally. The initial "bright" theme worked fine with inline colors, so no refactoring felt necessary.

**How to avoid:**
1. IMMEDIATELY extract all colors to a centralized `THEME.js` structure with semantic names (not just `primary`, `secondary`—use `textOnDark`, `buttonBg`, `successText`, etc.)
2. Create color objects for each mode: `THEME.light.colors.*` and `THEME.dark.colors.*`
3. Establish a rule: ZERO hard-coded color values in StyleSheets. Lint rule or code review checklist item
4. Use react-native-paper's theming system as the single source of truth for all colors—don't duplicate Paper's colors elsewhere
5. For inline styles, import theme and use computed styles: `<View style={{ backgroundColor: theme.colors.background }} />`

**Warning signs:**
- Grep searches find 20+ instances of the same color value
- Different files using different hex codes for "the same" color (#1e1e2d vs #1f1f2d)
- Color updates require changes in 10+ places
- Paper components use theme but custom components use hard-coded colors

**Phase to address:**
Phase 0 (Pre-redesign) - refactor color architecture BEFORE starting visual updates. This is prerequisite work, not part of visual redesign. If skipped, Phase 1 becomes 3x slower.

---

### Pitfall 3: Inadequate Real-Device Testing Across Screen Types

**What goes wrong:**
App looks "fine" on developer's MacBook (bright screen, 2pm) but is unreadable on user's phone (dark room, AMOLED screen at night). Dark gray backgrounds (#121212) chosen for development render differently across device types:
- OLED/AMOLED phones display blacks deeper than expected
- Regular LCD screens show the gray more muted
- Outdoor visibility completely fails
- iPad landscape orientation has different aspect ratio, changing perceived contrast

**Why it happens:**
Testing happens primarily in simulator or single device. Dark mode is complex enough that developers postpone "real device testing" thinking design is solid. The app ships, then user feedback floods in about readability. Dark gray choice seems arbitrary—developers don't realize the physical difference between #121212 on OLED vs. LCD.

**How to avoid:**
1. Establish device test matrix BEFORE Phase 1 redesign starts:
   - iPhone 12 (LCD, small screen)
   - iPhone 12 Pro (OLED, small screen)
   - iPad Pro (OLED, large screen, landscape mode critical)
   - One budget Android device (LCD, oversaturated)
2. Test in real lighting conditions: bright office, dark room, direct sunlight
3. Have non-lead developer test each screen in Phase 1 deliverable—they're "fresh eyes"
4. Measure contrast with physical contrast-checking app (WebAIM, Coolors, BrowserStack) on actual device photos
5. For iPad landscape: test button sizing, text readability at 50% viewport width

**Warning signs:**
- Redesign screenshots only taken in one lighting condition
- No device test data documented before Phase 2 starts
- iPad landscape mentioned but never actually tested on hardware
- Accessibility feedback comes after launch, not during development

**Phase to address:**
Phase 1 (Visual Redesign) - block design sign-off until 3+ devices tested in 2+ lighting conditions. iPad landscape specifically in Phase 2 (Screen Adaptations).

---

### Pitfall 4: Animation Transitions Breaking or Stuttering with Theme Switch

**What goes wrong:**
App has "nice" theme transition animation (smooth fade between light/dark). This animation tanks performance: frame drops from 60fps to 20fps, janky visual glitches, especially on older devices. Alternatively, animations work but theme switch breaks them—animated components freeze mid-animation when theme changes, or restart abruptly.

The app has custom animation screens (TextTransition, FlashAnimation components). These rely on `Reanimated` or `Animated` API. When theme switches mid-animation, the color values change but animation timing doesn't adjust—creates visual discontinuity.

**Why it happens:**
Smooth theme transitions seem like a nice UX touch, so developers add animated theme switching without profiling. They animate all style properties simultaneously (colors, shadows, opacity, transforms). This runs on the JS thread instead of native thread. Reanimated is needed for 60fps animation but requires `useNativeDriver: true`, which doesn't support animated colors. Developers try to animate colors on JS thread, causing jank.

Custom animations don't account for theme changes—they cache initial colors and don't recalculate during theme switch.

**How to avoid:**
1. For theme switching: SKIP animated theme transitions. Let theme switch happen instantly. Users expect instant preference changes (this matches iOS/Android system behavior)
2. If theme transition animation is a product requirement, use limited scope:
   - Only animate background color and text color (not shadows, not opacity)
   - Use `useNativeDriver: false` but accept 30fps as trade-off
   - OR use react-native-reanimated with `interpolateColor()` for true 60fps color animation (advanced)
3. For custom animations (TextTransition): ensure animated values are theme-aware:
   ```javascript
   // BAD: Hard-coded color in animation
   const colorValue = new Animated.Value(0);
   const color = colorValue.interpolate({
     inputRange: [0, 1],
     outputRange: ['#000000', '#ffffff'] // Locked to current theme at definition time
   });

   // GOOD: Theme-aware animation
   const colorValue = new Animated.Value(0);
   const color = colorValue.interpolate({
     inputRange: [0, 1],
     outputRange: [theme.colors.text, theme.colors.background]
   });
   ```
4. Test animations on iPhone 8 (older hardware) in both themes—if it drops frames, scale back animation complexity
5. Use `InteractionManager.runAfterInteractions()` to defer non-animation work during theme switch

**Warning signs:**
- Smooth theme transitions result in frame rate warnings in React Native debugger
- Theme switch causes animations to visibly stutter or restart
- Animation values don't update when theme changes mid-animation
- Older devices show noticeable jank during theme preference changes

**Phase to address:**
Phase 1 (Visual Redesign) - establish whether animated theme transitions are required; if yes, implement and profile immediately. Phase 3 (Animation Polish) - ensure custom animations respect theme changes and don't cause performance regressions.

---

### Pitfall 5: Incomplete Shadow and Elevation Implementation for Dark Theme

**What goes wrong:**
Material Design shadows that look great in light mode disappear entirely in dark mode. React-native-paper's `Surface` component (Card, Dialog, FAB) defaults `shadowColor: #000000`. In dark theme with dark backgrounds, black shadows become invisible—depth cues vanish, UI looks flat.

Example: Card components blend into background because shadow is undetectable. Modals appear to have no elevation. This breaks Material Design's elevation hierarchy.

**Why it happens:**
Developers assume Material Design components automatically adapt to dark theme. React-native-paper does adapt colors, but shadow color is a render property that doesn't change. The library defaults to black shadows for light theme, which doesn't adapt. Developers miss this because it's subtle—the UI is still clickable, just visually broken.

**How to avoid:**
1. Audit ALL shadow definitions in custom components:
   ```javascript
   // BAD: Hard-coded shadow for dark mode
   shadowColor: '#000000', // Invisible on dark bg

   // GOOD: Theme-aware shadow
   shadowColor: theme.colors.onBackground // Uses foreground color for contrast
   ```
2. For react-native-paper components, customize theme object to set shadow colors:
   ```javascript
   const darkTheme = {
     ...MD3DarkTheme,
     colors: {
       ...MD3DarkTheme.colors,
       // Paper doesn't expose shadowColor, so use custom styles
     }
   };
   ```
3. Use `elevation` property for Android (simpler than manual shadows)
4. Test all elevated surfaces (buttons, cards, modals) in dark theme to confirm depth is visible
5. Alternative approach: use border/opacity for depth instead of shadows in dark mode

**Warning signs:**
- Card components don't appear elevated in dark theme
- No visual hierarchy between modals and background
- Button shadows invisible despite `elevation: 5`
- Accessibility feedback: "I can't tell what's clickable"

**Phase to address:**
Phase 2 (Component Audit & Dark Theme Polish) - test and fix shadow rendering on all components using Paper or custom shadows.

---

### Pitfall 6: Text Readability with Custom Fonts in Dark Mode

**What goes wrong:**
App uses custom Google Fonts (Russo, Fascinate, Kablammo, etc.) that look striking in light mode but become hard to read in dark mode. Thin-weight fonts create halation (visible glow edges) on dark backgrounds. Decorative fonts lose legibility at small sizes against dark colors.

Example: "Russo" font at 14pt on #121212 background with white text becomes blurry and strained, especially on non-Retina displays.

**Why it happens:**
Custom fonts are chosen for visual impact in light theme. Dark mode rendering is different—thin strokes and serifs behave differently. Developers don't test font rendering in dark mode during font selection. The font looks fine on macOS design tool but renders differently on actual phones.

**How to avoid:**
1. Re-test all custom fonts in dark theme with actual user content (not just "sample text"):
   - Does it remain legible at minimum font size?
   - Does anti-aliasing create unwanted glow?
   - Is contrast sufficient for WCAG compliance?
2. Consider using a fallback font stack for dark mode:
   ```javascript
   const fontFamily = isDarkMode ? 'System' : 'Russo'; // Fallback to system in dark mode
   ```
   This is legitimate for readability
3. Increase minimum font size in dark mode (e.g., 16pt instead of 12pt)
4. Avoid thin-weight fonts in dark mode—use regular weight or bold
5. Test with actual device screenshots, not design previews

**Warning signs:**
- Users report custom fonts are "hard to read" specifically in dark mode
- Font selection depends on designer's monitor, not user's phone
- Small text in decorative fonts becomes unreadable in dark mode
- Screenshots show visible halation (glow) around custom font text

**Phase to address:**
Phase 1 (Visual Redesign) - audit custom fonts in dark theme before finalizing design. Phase 2 (Component Audit) - verify all font sizes meet readability standards.

---

### Pitfall 7: Inconsistent Color Behavior Across Paper Components

**What goes wrong:**
react-native-paper's `Button`, `Card`, `TextInput` components don't all respond to theme changes in the same way. Some automatically adapt, others require explicit theming. Custom components created alongside Paper components use different color sources, causing inconsistency. One button is Paper-themed (dark theme works), another is custom (hard-coded colors, dark theme fails).

**Why it happens:**
Developers mix Paper-provided components with custom components without a unified theming approach. Paper's theming system is optional—you can use Button without ThemeProvider and it works with default colors. This creates false sense that theming is optional. When dark mode arrives, some components break.

**How to avoid:**
1. Enforce `<PaperProvider theme={theme}>` wrapping entire app—REQUIRED, not optional
2. Establish rule: all custom components must accept theme as prop:
   ```javascript
   const MyCustomButton = ({ theme, ...props }) => (
     <Pressable style={{ backgroundColor: theme.colors.primary }} {...props} />
   );
   ```
3. Use `useTheme()` hook in every component that needs colors:
   ```javascript
   const MyComponent = () => {
     const theme = useTheme();
     return <View style={{ backgroundColor: theme.colors.background }} />;
   };
   ```
4. Audit all components during Phase 2: check if they're using Paper colors or custom colors
5. Never mix theme sources—don't have component using Paper colors AND custom COLORS.js value

**Warning signs:**
- Some buttons look "dark themed" and others don't
- TextInput backgrounds don't match theme
- Color inconsistency between screens
- Grep shows components importing both `useTheme` and custom `COLORS`

**Phase to address:**
Phase 0 (Pre-redesign architecture) - establish unified theming pattern. Phase 1 (Visual Redesign) - convert all custom colors to theme-driven. Phase 2 (Component Audit) - verify consistency across all Paper components.

---

### Pitfall 8: iPad Landscape Layout Breaks with Dark Theme

**What goes wrong:**
iPad portrait mode looks fine in dark theme. Landscape mode reveals layout problems: buttons designed for portrait are too wide in landscape, text gets cut off, contrast issues appear that weren't visible in portrait, status bar behavior differs.

Specific risk: button widths hard-coded to `300px` (from current code) become disproportionate on landscape iPad. Colors that pass contrast in portrait might fail in landscape due to different perceived brightness from wider screen.

**Why it happens:**
Developers focus on phone sizes (typical). iPad landscape is tested late or not at all. The app has orientation detection code but styles weren't designed for landscape dimensions. Contrast testing happens on iPhone only; iPad's larger screen and different pixel density create new contrast problems.

**How to avoid:**
1. Design for landscape FIRST, not last:
   - Use responsive dimension calculations: `const buttonWidth = Dimensions.get('window').width > 700 ? 250 : 300`
   - Test every screen in both portrait and landscape on actual iPad
2. Create layout variants:
   ```javascript
   const isLandscape = Dimensions.get('window').width > Dimensions.get('window').height;
   const styles = StyleSheet.create({
     button: {
       width: isLandscape ? 250 : 300,
       paddingHorizontal: isLandscape ? 12 : 16,
     }
   });
   ```
3. Re-run contrast tests in landscape mode—different viewing angle changes perceived brightness
4. Test button hit targets in landscape (ensure 44pt minimum per Apple HIG)
5. iPad-specific: test in split-view mode (app at 50% width)

**Warning signs:**
- Layout works in phone simulator, breaks on iPad hardware
- Buttons overflow or overlap in landscape
- Text gets cut off when screen rotates
- Status bar behavior differs between portrait and landscape
- Contrast issues only appear on iPad, not phone

**Phase to address:**
Phase 2 (Screen Adaptations) - landscape and iPad layout must be tested and fixed during visual redesign, not after.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hard-coded shadow colors instead of theme-driven | Faster to write, "looks good" on one device | Shadows invisible in dark mode, requires audit and fixes on 20+ components | Never—do it right from start |
| Skip dark theme transition animation, instant switch | Simpler code, no performance concerns | Users perceive jarring instant change (minor UX issue) | RECOMMENDED—instant is fine, matches OS behavior |
| Use `useColorScheme()` without caching, re-run on every render | No cache complexity | Performance cost is negligible for simple color lookups | ACCEPTABLE—caching not necessary for small apps |
| Test dark theme on simulator only, not real devices | Saves device testing time | Ship broken dark theme, user complaints, credibility damage | Never—must test real devices |
| Defer iPad landscape testing to post-launch | Focus dev time on core features | App is broken for iPad users at launch, large user segment affected | Never—test during Phase 1 |
| Use react-native-paper components without theming | Uses Paper defaults "out of box" | Dark mode doesn't work, components have hard-coded colors | Never—PaperProvider is mandatory |

---

## Integration Gotchas

Common mistakes when connecting dark theme to external services or system preferences.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| System preference (Appearance API) | Hard-code `useColorScheme()` without user override—ignores user who set dark mode in Settings | Implement: System preference → User toggle override. Cache user choice in AsyncStorage. Check system pref on app launch, then respect stored user preference |
| Gradient colors (expo-linear-gradient) | Gradient colors use hard-coded hex values, don't respond to theme changes | Extract gradient stops to theme object: `const gradient = isDarkMode ? [theme.colors.bg1, theme.colors.bg2] : [...]` |
| Custom fonts + dark mode | Font files loaded once at startup, assumed to work in both themes | No action needed if using system fonts. If using Google Fonts, test rendering in both modes pre-launch |
| Animated backgrounds (shared values) | Animation initial values set with light theme colors, don't update when theme switches | Reset animation values when theme changes: `useEffect(() => { bgColor.value = getColorForTheme(theme); }, [theme])` |
| StatusBar color | Developers hard-code light StatusBar in dark app or vice versa | Set StatusBar content style based on theme: `<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />` |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Recalculating contrast on every render | App feels slow when navigating between screens, no obvious cause | Memoize contrast calculations: `useMemo(() => getContrastColor(bgColor), [bgColor])` | 20+ components doing contrast calc simultaneously |
| Animated theme transitions with all properties | Frame rate drops to 20fps during theme switch | Skip animated transitions OR animate only colors, not transforms/shadows | More than 50 components with animated styles |
| Gradient re-computation on theme change | Gradient flickers or delays when switching themes | Pre-calculate gradients and store in theme object, don't compute in render | Backgrounds with 3+ gradient layers |
| InteractionManager deferral overuse | App becomes unresponsive to user input after theme switch | Use sparingly—only defer non-critical work (analytics, cleanup) | Defer more than 2-3 operations per theme switch |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing user's selected color preferences in plain text AsyncStorage | Minimal risk—colors aren't sensitive, but establishes bad pattern | Use standard AsyncStorage (colors are NOT secrets), but establish that secrets NEVER go in AsyncStorage (use expo-secure-store instead) |
| Leaking theme provider context outside its scope | Extremely low risk in mobile context, but bad practice | Wrap theme provider at app root only, don't export or share theme context elsewhere |
| Hard-coding API key colors or debug mode indicators in dark theme | Accidentally ship debug UI to production when switching themes | Use separate config file for debug features, not theme system; never use colors for feature flags |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Forcing dark theme on all users | Users who prefer light mode feel ignored; accessibility issue for some | Provide theme toggle; respect system setting; remember user choice |
| No preview of theme change before applying | Users apply dark theme, hate it, have to dig through settings to revert | Add temporary theme preview toggle before saving preference |
| Custom colors don't work intuitively in dark mode | User selects bright yellow (#FFFF00) expecting it to display same as light mode; it vibrates on dark bg | Provide color picker preview that shows BOTH light and dark rendering. Auto-adjust color recommendation for selected theme |
| Busy animations in dark theme cause more eye strain | Users complain dark mode is "harder on eyes" if animations are too aggressive | Reduce animation duration or opacity in dark mode. Respect `prefers-reduced-motion` system setting |
| Text becomes harder to scan in dark mode | Users find dark mode "harder to read" even if contrast is technically correct | Increase line height, letter spacing, and font weight slightly in dark mode |
| App doesn't adapt to lighting conditions | Dark theme at midnight is perfect; dark theme in bright office is unreadable | Use `useColorScheme()` to detect system preference AND allow manual override for users in unusual lighting |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Contrast Testing:** Verified with WCAG 2.0 contrast ratio 4.5:1 for ALL visible text combinations in dark theme, not just eyeballing
- [ ] **Color Consistency:** Audited codebase—zero hard-coded colors, all from theme object, grep confirms no stray `#` hex values in StyleSheets
- [ ] **Shadow Rendering:** Confirmed shadows visible on Card/Surface/elevated components in dark theme, not just in light theme
- [ ] **Device Testing:** Tested on minimum 2 physical devices (iOS + Android) in 2+ lighting conditions (bright, dark), not simulator only
- [ ] **iPad Landscape:** Tested on actual iPad in landscape orientation—buttons sized correctly, text readable, no layout breakage
- [ ] **Custom Font Rendering:** All custom fonts tested in dark theme; readability verified, no unwanted halation effects
- [ ] **Animation Performance:** Theme switch doesn't cause frame rate drops below 50fps on iPhone 8 (oldest supported device)
- [ ] **Status Bar:** StatusBar content color adapts to theme (light content on dark, dark content on light)
- [ ] **User Preference Saved:** User's theme choice persists across app restarts via AsyncStorage, not re-reading system setting every launch
- [ ] **Animated Components:** Custom animations (TextTransition, FlashAnimation) tested with theme changes mid-animation—no stutters or color discontinuities
- [ ] **Paper Components:** All react-native-paper Button/Card/TextInput wrapped in PaperProvider with custom theme, not using defaults
- [ ] **Gradient Colors:** Expo LinearGradient colors updated for both themes, gradients don't break in dark mode

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Discovered contrast failures after launch | MEDIUM (1-2 weeks) | 1. Identify affected color combinations. 2. Desaturate problematic colors. 3. Test immediately on devices. 4. Ship hotfix. 5. Establish contrast testing in CI |
| Hard-coded colors scattered across 20+ files | HIGH (2-4 weeks) | 1. Extract all colors to THEME.js. 2. Refactor components to use theme. 3. Test each screen. 4. Establish linting rule to prevent regression. 5. Code review to enforce |
| Shadows invisible in dark theme discovered post-launch | MEDIUM (1 week) | 1. Audit all shadow definitions. 2. Create theme-aware shadow colors. 3. Update components. 4. Re-test. 5. Document shadow pattern |
| iPad landscape broken (buttons overflow, text cut off) | MEDIUM (1-2 weeks) | 1. Refactor layout to use responsive dimensions. 2. Create landscape-specific styles. 3. Test on iPad hardware. 4. Fix orientation change handling. 5. Add landscape testing to CI |
| Custom fonts unreadable in dark mode | LOW-MEDIUM (3-5 days) | 1. Decide: replace font or increase size. 2. Update font selection logic. 3. Test readability. 4. If replaced, notify design team. 5. Document decision |
| Theme animations cause jank | MEDIUM (1 week) | 1. Disable animated transitions, use instant switch. 2. Profile performance. 3. If instant acceptable (it is), ship. 4. If animation required, implement react-native-reanimated color interpolation |
| Inconsistent colors between Paper and custom components | HIGH (2-3 weeks) | 1. Audit all components. 2. Migrate custom colors to theme-driven. 3. Ensure all components use useTheme(). 4. Test for consistency. 5. Establish pattern in team guidelines |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Contrast Failure on Colored Backgrounds | Phase 1 (Visual Redesign) | Run contrast checker on all user color combinations; document WCAG AA compliance matrix |
| Hard-Coded Colors in Inline StyleSheets | Phase 0 (Pre-redesign) | Grep codebase: zero instances of `#` color values in StyleSheets; all from THEME object |
| Inadequate Real-Device Testing | Phase 1 (Visual Redesign) | Test on 2+ devices, 2+ lighting conditions before Phase 1 sign-off; document device test matrix |
| Animation Transitions Breaking | Phase 1 (Visual Redesign) | Profile theme switch performance; confirm 50fps+ on iPhone 8; skip animated transitions or implement react-native-reanimated |
| Incomplete Shadow Implementation | Phase 2 (Component Audit & Polish) | Audit all elevated components; shadows visible in dark theme; no visual regression |
| Text Readability with Custom Fonts | Phase 1 (Visual Redesign) | Test all custom fonts in dark mode; verify WCAG AA compliance; document minimum font sizes |
| Inconsistent Paper Component Behavior | Phase 0 (Pre-redesign Architecture) | All components use PaperProvider + useTheme(); no hard-coded colors; consistency audit in Phase 2 |
| iPad Landscape Layout Breaks | Phase 2 (Screen Adaptations) | Test on iPad hardware in both orientations; button sizing responsive; layout doesn't break |

---

## Sources

- [React Native Appearance API - Official Docs](https://reactnative.dev/docs/appearance)
- [React Native Paper Theming Guide](https://callstack.github.io/react-native-paper/docs/guides/theming/)
- [NN/G: Dark Mode Design Principles](https://www.nngroup.com/articles/dark-mode-users-issues/)
- [Smashing Magazine: Inclusive Dark Mode Design](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/)
- [WCAG 2.0 Contrast Requirements](https://www.accessibilitychecker.org/blog/dark-mode-accessibility/)
- [Deque: Testing Color Contrast in Mobile Apps](https://www.deque.com/blog/testing-color-contrast-in-mobile-apps/)
- [Toptal: Dark UI Design Best Practices](https://www.toptal.com/designers/ui/dark-ui)
- [Dark Mode Done Right: Step-by-Step Guide](https://thisisglance.com/blog/dark-mode-done-right-a-step-by-step-guide-for-app-developers)
- [React Native Animations - Official Docs](https://reactnative.dev/docs/animations)
- [Medium: Smooth Theme Transition Animations in React Native](https://medium.com/@wadahesam/smooth-dark-light-theme-transition-animations-in-react-native-17c0632ecec4)
- [Apple HIG: Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)
