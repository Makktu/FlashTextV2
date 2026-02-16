# Project Research Summary

**Project:** FlashText Dark UI Redesign
**Domain:** Mobile app dark theme redesign (React Native + Expo 51)
**Researched:** 2026-02-16
**Confidence:** HIGH

## Executive Summary

FlashText is transitioning from a bright, glassmorphic UI to a professional, dark-themed interface inspired by Linear and Vercel design systems. The research reveals that **no major new dependencies are needed**—the existing stack (React Native Paper 5.x, Expo 51, Reanimated 3.10) already provides everything required. The critical success factors are: (1) migrating from hard-coded inline colors to a centralized theme system, (2) ensuring WCAG 2.0 contrast compliance (4.5:1) across all user-selectable color combinations, and (3) testing on real devices in multiple lighting conditions, especially iPad landscape.

The recommended approach centers on **React Native Paper's Material Design 3 dark theme** with custom color overrides. This leverages built-in dark mode support, automatic elevation handling, and component theming—eliminating the need for custom theme infrastructure. The architecture follows a Context-based ThemeProvider pattern wrapped around PaperProvider, with all components consuming theme via hooks (not prop drilling).

**Key risks:** (1) Contrast failures on colored backgrounds (FlashText's core feature), (2) animation performance degradation during theme switches, (3) shadow invisibility in dark mode, and (4) iPad landscape layout breakage. All are preventable through early testing, theme-aware color selection, and proper dark mode shadow implementation. The path forward is a visual refactoring project, not an architectural rebuild.

## Key Findings

### Recommended Stack

The existing stack is sufficient for dark theme redesign. **No new frameworks or major library upgrades required.** The key decision is upgrading react-native-paper from 5.12.5 to 5.15.0 for Material Design 3's adaptive dark theme mode, which automatically handles elevation overlays and component dark variants.

**Core technologies:**
- **react-native-paper 5.15.0** (upgrade from 5.12.5): Material Design 3 components with built-in MD3DarkTheme — eliminates need for custom theming layer
- **React Native Appearance API** (native): System color scheme detection — already available, no installation needed
- **AsyncStorage** (existing): Theme preference persistence — lightweight, works reliably
- **react-native-reanimated 3.10.1** (keep): Smooth animations compatible with dark theme — current version is stable (note: v3 is in maintenance mode; consider v4 upgrade post-redesign for long-term maintenance)
- **expo-linear-gradient 13.0.2** (keep): Dark gradient backgrounds for Linear/Vercel aesthetic — perfect for dark-on-dark overlays

**What NOT to add:**
- NativeWind/Tailwind — unnecessary complexity; Paper's theme system is simpler and already integrated
- Unistyles — overkill for visual-only redesign; Paper handles theming sufficiently
- Custom theming library — Paper's MD3DarkTheme eliminates this need entirely

**Optional additions (post-launch):**
- `@pchmn/expo-material3-theme` — dynamic color generation from Android 12+ system colors (Phase 2 feature)
- `tinycolor2` — runtime color adjustments for custom shade generation (only if needed)

### Expected Features

**Must have (table stakes v1):**
- **Dark gray background (#121212)** — pure black (#000000) causes halation and eye strain for 30-60% of users with astigmatism
- **Text contrast 4.5:1 minimum (WCAG 2.0)** — legal/accessibility requirement; test every user color combination
- **Desaturated accent color system** — bright colors vibrate on dark backgrounds; desaturate 20-40% for dark mode
- **Hover/focus states with visual feedback** — users must know what's interactive; default, hover, focus, active, disabled states required
- **Elevation via color gradation** — traditional shadows invisible in dark mode; use progressively lighter surface tints for depth
- **Theme persistence** — remember user's light/dark choice across restarts (AsyncStorage)
- **Focal preview card (elevated + highlighted)** — core FlashText differentiator; must work from day one

**Should have (v1.x polish):**
- **Glassmorphism on modals/overlays** — adds premium feel; requires gradient backgrounds first
- **Subtle gradient backgrounds** — dark-to-slightly-lighter or color-tinted gradients for visual interest
- **Inner glow on focal card** — accent the preview window; enhances elevation system
- **Smooth state animations** — 100-300ms transitions; polish feature, not essential

**Defer (v2+):**
- **LCH color space dynamic system** — Linear's 3-variable color approach; complex but enables customizable contrast levels
- **Customizable contrast levels** — reduced/normal/high-contrast modes; niche feature, add only if user demand exists
- **Animated gradient backgrounds** — performance cost; defer until product-market fit established

**Anti-features (deliberately avoid):**
- Pure black backgrounds — causes halation and eye strain
- Highly saturated accent colors — vibrate on dark backgrounds, fail accessibility
- Aggressive glassmorphism everywhere — reduces clarity; use sparingly
- Pure white text on dark gray — excess contrast causes halation; use off-white (#F0F0F0)
- Color-only accessibility cues — must pair with icons/shapes for color-blind users

### Architecture Approach

The standard architecture for dark-themed React Native apps uses a **Context-based ThemeProvider** wrapping **PaperProvider** with Paper-compatible theme objects. All components consume theme via `useTheme()` hook, not prop drilling. Styles are split into static (StyleSheet.create for padding, fonts) and dynamic (inline theme colors).

**Major components:**
1. **ThemeContext + ThemeProvider** — manages theme state, system detection (Appearance API), persistence (AsyncStorage), toggle function; wraps entire app
2. **PaperProvider** — bridges custom theme to react-native-paper components; ensures automatic component theming
3. **Theme objects (light.js, dark.js)** — Material Design 3-compatible color structures; defines primary, secondary, surface, background, error, etc.
4. **useThemedStyles hook** — custom hook with useMemo for memoized style generation; prevents recalculation on every render
5. **Animated color transitions** — react-native-reanimated's `interpolateColor` for smooth theme switches (optional; instant switch is also acceptable)

**Project structure:**
```
src/
├── theme/
│   ├── ThemeContext.js        # React Context + provider
│   ├── useTheme.js            # Custom hook
│   ├── themes/
│   │   ├── light.js           # Light theme (Paper format)
│   │   ├── dark.js            # Dark theme (Paper format)
│   │   └── tokens.js          # Shared tokens
│   └── hooks/
│       ├── useThemedStyles.js # Memoized styles
│       └── useAnimatedTheme.js # For reanimated
├── values/
│   ├── COLORS.js              # MIGRATE to theme/tokens
│   └── THEME.js               # NEW - Paper-compatible themes
```

**Critical pattern:** Extract all hard-coded colors from inline StyleSheets to centralized theme tokens BEFORE starting visual redesign. Zero tolerance for hard-coded hex values in components.

### Critical Pitfalls

1. **Contrast failure on colored backgrounds** — FlashText displays colored text on colored backgrounds (core feature). User-selected colors that work in light mode fail WCAG AA (4.5:1) in dark mode. Bright colors create halation (vibration effect). **Prevention:** Build contrast-checking matrix for every user color combination in both themes; desaturate bright colors 20-40% in dark mode; implement automatic fallback if contrast fails; use tinycolor2 for runtime luminance calculations.

2. **Hard-coded colors in inline StyleSheets** — Current codebase has scattered inline `StyleSheet.create()` with hard-coded hex values. Updating colors requires grep+replace across 50+ files, causing inconsistency. **Prevention:** Extract all colors to THEME.js BEFORE starting redesign (Phase 0); enforce zero hard-coded colors via linting; use Paper theme as single source of truth; establish code review checklist.

3. **Inadequate real-device testing across screen types** — App looks fine on developer's MacBook but fails on user's AMOLED phone in dark room. Dark gray (#121212) renders differently on OLED vs LCD. iPad landscape reveals layout problems invisible in portrait. **Prevention:** Test on minimum 2 physical devices (iOS + Android) in 2+ lighting conditions (bright office, dark room); include iPad landscape in every screen test; measure contrast with physical contrast checker on actual device photos.

4. **Animation transitions breaking with theme switch** — FlashText has custom animations (TextTransition, FlashMessage). Theme switch mid-animation causes color values to change but animation timing doesn't adjust—visual discontinuity. Alternatively, smooth theme transitions tank performance (60fps to 20fps). **Prevention:** Skip animated theme transitions (instant switch matches OS behavior); ensure animated values are theme-aware by extracting colors from theme object, not hard-coding in interpolation ranges; test animations on iPhone 8 (older hardware).

5. **Incomplete shadow and elevation implementation** — Material Design shadows (black) invisible in dark mode; Card/Surface components blend into background. Paper's default `shadowColor: #000000` doesn't adapt. **Prevention:** Use theme-aware shadow colors (`shadowColor: theme.colors.onBackground`); use elevation property for Android; test all elevated surfaces in dark theme; consider borders/opacity for depth instead of shadows.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 0: Theme Architecture Foundation (PREREQUISITE)
**Rationale:** All visual work depends on centralized theme system. Starting visual redesign with scattered hard-coded colors will triple implementation time and create maintenance nightmare.

**Delivers:** Centralized theme infrastructure ready for dark mode colors

**Addresses:**
- Extract all hard-coded colors from components to THEME.js
- Create ThemeContext with Appearance API detection + AsyncStorage persistence
- Define Paper-compatible theme objects (light.js, dark.js)
- Create useTheme() and useThemedStyles() hooks
- Wrap AppLoader with ThemeProvider + PaperProvider
- Establish zero-tolerance rule for hard-coded colors

**Avoids:** Hard-coded colors scattered across codebase (Pitfall #2); inconsistent Paper component behavior (Pitfall #7)

**Research flag:** No additional research needed—well-documented pattern

### Phase 1: Core Visual Redesign
**Rationale:** With theme architecture in place, convert existing bright UI to dark Material Design 3 aesthetic. Focus on main screens (Main, FlashScreen) and establish visual language.

**Delivers:** Dark theme applied to primary screens with WCAG AA contrast compliance

**Addresses:**
- Dark gray background (#121212, not pure black)
- Desaturated accent color system (blue/teal)
- Text contrast 4.5:1 minimum on all backgrounds
- Elevation via color gradation (not shadows)
- Focal preview card with highlight/glow
- Theme toggle and persistence

**Uses:**
- react-native-paper 5.15.0 MD3DarkTheme
- expo-linear-gradient for subtle gradient backgrounds
- Theme-aware shadow colors

**Avoids:** Pure black backgrounds (Pitfall #1 halation); contrast failures (Pitfall #1); inadequate device testing (Pitfall #3)

**Critical testing:** Test on 2+ devices (iOS/Android), 2+ lighting conditions (bright/dark), verify contrast with WCAG checker

**Research flag:** No additional research needed—features and patterns established

### Phase 2: Component Theming & Polish
**Rationale:** Ensure all UI components (GridButtons, InputBox, PreviewWindow, MyButton, FontSelector) consume theme consistently. Audit for visual consistency and accessibility.

**Delivers:** All components theme-aware with consistent styling

**Implements:**
- GridButtons with themed button colors via useThemedStyles
- InputBox with themed input styling
- PreviewWindow with themed preview colors
- MyButton semantic component
- FontSelector with dark mode font rendering
- Options screen for theme selector UI

**Avoids:** Inconsistent Paper component behavior (Pitfall #7); text readability with custom fonts (Pitfall #6); shadow invisibility (Pitfall #5)

**Critical testing:** Verify custom fonts (Russo, Fascinate, etc.) readable in dark mode; test shadows visible on all elevated components; confirm Paper components consistently themed

**Research flag:** No additional research needed—component patterns are standard

### Phase 3: iPad & Landscape Adaptations
**Rationale:** iPad landscape mode requires responsive layout adjustments. Button widths hard-coded to 300px become disproportionate in landscape. Contrast may differ at different viewing angles.

**Delivers:** Responsive layouts for iPad portrait, landscape, and split-view

**Addresses:**
- Responsive dimension calculations (not hard-coded 300px buttons)
- Layout variants for portrait vs landscape
- Button hit targets 44pt minimum (Apple HIG)
- Contrast verification in landscape orientation
- Status bar behavior in both orientations

**Avoids:** iPad landscape layout breakage (Pitfall #8)

**Critical testing:** Test on actual iPad hardware in both orientations; verify split-view mode (50% width); re-run contrast tests in landscape

**Research flag:** No additional research needed—responsive patterns documented

### Phase 4: Animation Integration
**Rationale:** FlashText's core feature is animated text display. Ensure animations (FlashMessage, TextTransition) work with dark theme colors and don't break during theme switches.

**Delivers:** Theme-aware animations with smooth color transitions

**Implements:**
- Update FlashMessage to animate between theme color palettes
- Update TextTransition for theme-aware animations
- Optional: smooth color transitions with react-native-reanimated's `interpolateColor`
- Ensure animations respect prefers-reduced-motion

**Avoids:** Animation transitions breaking (Pitfall #4); performance degradation during theme switch

**Critical testing:** Profile theme switch performance (50fps+ on iPhone 8); test animations mid-theme-switch for visual discontinuities; measure frame rate with React Native debugger

**Research flag:** No additional research needed—Reanimated interpolateColor pattern established

### Phase 5: User Color Selection & Contrast Validation
**Rationale:** FlashText allows users to select custom background/text colors. These must work in both light and dark themes with automatic contrast validation.

**Delivers:** Color picker with dark mode preview and automatic contrast adjustment

**Addresses:**
- Contrast-checking matrix for all user color combinations
- Desaturate bright colors automatically in dark mode
- Color picker preview showing both light and dark rendering
- Automatic fallback if selected colors fail contrast
- Runtime luminance calculations (tinycolor2)

**Avoids:** Contrast failures on colored backgrounds (Pitfall #1—the highest-risk pitfall for FlashText)

**Critical testing:** Test every selectable color combination against WCAG 2.0; verify auto-adjustment doesn't break user intent; test with color-blindness simulators

**Research flag:** **NEEDS RESEARCH** — complex domain-specific problem; contrast validation algorithms require deeper investigation during phase planning

### Phase Ordering Rationale

**Why this order:**
1. **Phase 0 blocks all others** — theme architecture must exist before visual work begins; attempting component theming without ThemeProvider causes runtime errors
2. **Phase 1 establishes visual language** — main screens define dark aesthetic; later components inherit patterns
3. **Phase 2 depends on Phase 1 completion** — components inherit theme established in Phase 1; premature component work creates rework
4. **Phase 3 can run parallel to Phase 2** — iPad layout is screen-level, not component-level; can start once Phase 1 visual patterns are set
5. **Phase 4 requires Phase 2 components** — animations need themed components to animate; can't test animations until components exist
6. **Phase 5 is highest-risk, requires foundation** — user color selection is FlashText's core differentiator; needs solid theme foundation and tested components before adding complexity

**Critical path:** Phase 0 → Phase 1 → Phase 2 → Phase 4 → Phase 5 (Phase 3 can run parallel to Phase 2)

**Groupings based on architecture:**
- **Infrastructure (Phase 0):** Theme system, context, hooks
- **Visual redesign (Phase 1-2):** Screens and components
- **Platform adaptations (Phase 3):** Responsive layouts
- **Core features (Phase 4-5):** Animations and color selection

**How this avoids pitfalls:**
- Phase 0 prevents hard-coded color sprawl (Pitfall #2)
- Phase 1 enforces device testing early (Pitfall #3)
- Phase 2 catches shadow/font issues before launch (Pitfall #5, #6)
- Phase 3 prevents iPad layout breakage (Pitfall #8)
- Phase 4 ensures animation performance (Pitfall #4)
- Phase 5 addresses highest-risk contrast failures (Pitfall #1)

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 5 (User Color Selection & Contrast Validation):** Complex domain-specific problem; WCAG 2.0 contrast algorithms, automatic color adjustment strategies, runtime luminance calculations, handling edge cases (user picks two nearly-identical colors). Needs `/gsd:research-phase` for contrast validation implementation patterns.

**Phases with standard patterns (skip research-phase):**
- **Phase 0:** Context API + AsyncStorage + Paper theming — well-documented, industry-standard pattern
- **Phase 1:** Material Design 3 dark theme — official Paper docs cover this extensively
- **Phase 2:** Component theming with hooks — standard React Native pattern
- **Phase 3:** Responsive layouts — Dimensions API well-documented
- **Phase 4:** Reanimated color interpolation — official Reanimated docs + examples available

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official react-native-paper 5.15.0 docs verified; Material Design 3 support confirmed; all dependencies already installed and stable |
| Features | HIGH | Multiple industry sources (Linear, Raycast, Vercel) confirm table-stakes dark mode features; WCAG 2.0 standards well-established; anti-features validated by accessibility research |
| Architecture | HIGH | Context API + PaperProvider pattern verified in official React Native and Paper docs; community consensus on theming approach; clear separation of concerns |
| Pitfalls | HIGH | Verified with official React Native docs, Smashing Magazine accessibility research, NN/G dark mode studies, and WCAG 2.0 guidelines; pitfalls confirmed by community sources and LogRocket best practices |

**Overall confidence:** HIGH

All research findings backed by official documentation (React Native, react-native-paper, Expo, Material Design 3) and established industry patterns (Linear, Vercel, Raycast design systems). No speculative recommendations—every suggestion is verified.

### Gaps to Address

**Minor gaps requiring validation during implementation:**

1. **Custom font rendering in dark mode:** Research confirms custom fonts (Russo, Fascinate, Kablammo) require testing for readability and halation in dark mode, but specific font+background combinations need empirical testing on actual devices. **Handling:** Phase 1 must include device testing; may require font weight adjustments or fallback fonts in dark mode.

2. **Contrast validation algorithm selection:** Multiple approaches exist (WCAG 2.0 relative luminance, APCA, LCH color space). Research identifies WCAG 2.0 as legal baseline but doesn't prescribe specific implementation. **Handling:** Phase 5 planning should research contrast calculation libraries (tinycolor2 vs wcag-contrast vs alternatives) and test accuracy.

3. **Reanimated 3 vs 4 upgrade decision:** Current version (3.10.1) is in maintenance mode; Reanimated 4 is current. Research confirms both work for dark theme animations. **Handling:** Decision deferred to post-redesign; v3 is sufficient for this project, but long-term maintenance may require v4 upgrade.

4. **Dynamic color system (Material You) on iOS:** Research confirms Android 12+ dynamic color extraction works via `@pchmn/expo-material3-theme`, but iOS 16+ support is less documented. **Handling:** Defer to Phase 2 (v1.x) as optional feature; test on iOS devices if implemented.

**No critical gaps identified.** All core technical decisions are backed by verified sources.

## Sources

### Primary (HIGH confidence)

**Official Documentation:**
- [React Native Paper v5 Theming](http://oss.callstack.com/react-native-paper/docs/guides/theming/) — Material Design 3, dark theme modes
- [React Native Appearance API](https://reactnative.dev/docs/appearance) — System color scheme detection
- [Expo Color Themes Documentation](https://docs.expo.dev/develop/user-interface/color-themes/) — userInterfaceStyle config, useColorScheme hook
- [React Native Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/) — Color interpolation for transitions
- [WCAG 2.0 Contrast Requirements](https://www.accessibilitychecker.org/blog/dark-mode-accessibility/) — Accessibility standards

**Industry References:**
- [How we redesigned the Linear UI (part II)](https://linear.app/now/how-we-redesigned-the-linear-ui) — Linear's dark mode approach
- [Raycast Custom Themes](https://manual.raycast.com/custom-themes) — Color system patterns
- [Vercel Geist Theme Switcher](https://vercel.com/geist/theme-switcher) — Theme architecture

### Secondary (MEDIUM confidence)

**Best Practices:**
- [LogRocket: Best React Native UI Libraries 2026](https://blog.logrocket.com/best-react-native-ui-component-libraries/) — Paper ecosystem position
- [LogRocket: Dark Mode in React Native](https://blog.logrocket.com/comprehensive-guide-dark-mode-react-native/) — Implementation patterns
- [NN/G: Dark Mode Design Principles](https://www.nngroup.com/articles/dark-mode-users-issues/) — User research findings
- [Smashing Magazine: Inclusive Dark Mode](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/) — Accessibility guidelines
- [Toptal: Dark UI Design Best Practices](https://www.toptal.com/designers/ui/dark-ui) — Professional design patterns

**Technical Deep Dives:**
- [Dark Mode Implementation with Context API - OpenReplay](https://blog.openreplay.com/control-dark-mode-in-react-native-with-the-context-api/) — Context + AsyncStorage pattern
- [Theme Switching Optimization - Medium](https://jerrintkg.medium.com/theme-switching-in-react-native-e26eabac113e) — useMemo + StyleSheet strategy
- [Material Design Dark Theme](https://design.google/library/material-design-dark-theme/) — Elevation and color principles

### Tertiary (supporting context)

- Design system documentation (Linear, Raycast, Vercel)
- Community tutorials (LogRocket, Bootcamp, Medium)
- Accessibility research (Deque, AccessibilityChecker)
- UI component examples (Aceternity, Shadcn)

---
*Research completed: 2026-02-16*
*Ready for roadmap: yes*
