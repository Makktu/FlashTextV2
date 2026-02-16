# Architecture

**Analysis Date:** 2026-02-16

## Pattern Overview

**Overall:** Component-based React Native application with a modal/screen navigation pattern

**Key Characteristics:**
- Mobile-first design using Expo framework for iOS/Android
- Screen-based navigation with Main screen as central hub
- Component decomposition for UI controls and animations
- Configuration-driven styling and font handling
- Responsive design with platform-specific (iPad) adaptations

## Layers

**Presentation Layer (Screens & Components):**
- Purpose: Renders UI and handles user interactions
- Location: `src/screens/` and `src/components/`
- Contains: Screen components (Main, FlashScreen), reusable UI components (GridButtons, PreviewWindow)
- Depends on: Values layer (colors, fonts), Utils layer (screen dimensions)
- Used by: App entry point

**Animation Layer:**
- Purpose: Handles text animation effects during flash presentation
- Location: `src/screens/subflash screens/`
- Contains: FlashPlain, FlashSwoosh, FlashStretch animation implementations
- Depends on: react-native-reanimated, Values layer
- Used by: FlashScreen to render different animation styles

**Values & Configuration Layer:**
- Purpose: Centralized constants and configuration
- Location: `src/values/`
- Contains: COLORS.js (color palette), fontScalingFactors.js (font sizing rules), AppLoader.jsx (initialization)
- Depends on: Expo libraries for font loading
- Used by: All presentation and animation layers

**Utilities Layer:**
- Purpose: Helper functions for cross-cutting concerns
- Location: `src/utils/`
- Contains: screenDimensions.js (device detection and dimension calculation)
- Depends on: React Native platform APIs
- Used by: All layers that need responsive sizing

## Data Flow

**Main Application Flow:**

1. App.jsx → AppLoader (font initialization)
2. AppLoader → Main (user interface)
3. User enters text and configures options in Main screen
4. User presses START button → Main state updates choppedMessage array
5. Main switches to FlashScreen with configuration props
6. FlashScreen selects animation type → renders FlashPlain/FlashSwoosh/FlashStretch
7. Animation component loops through words array, applying animations
8. User taps screen → returns to Main screen

**State Management:**
- Centralized in `src/screens/Main.jsx` using React hooks (useState)
- State includes: text input, message history, current flash type, duration, colors, fonts
- Modal overlays (history modal) managed with visibility flags
- Animation triggers via animationTrigger prop passed to PreviewWindow

**Configuration Propagation:**
- Main.jsx holds configuration state (flashType, duration, userFont, userBgColor, randomizeBgColor)
- Props drilled to GridButtons for user interaction
- Props drilled to PreviewWindow for live preview
- Configuration passed to FlashScreen for flash playback

## Key Abstractions

**FlashScreen (Animation Orchestrator):**
- Purpose: Selects and renders the appropriate animation component based on flashType
- Examples: `src/screens/FlashScreen.jsx` routes to `src/screens/subflash screens/FlashPlain.jsx`, FlashSwoosh.jsx, FlashStretch.jsx
- Pattern: Conditional rendering based on props, orientation locking for iPad

**GridButtons (Configuration Control Hub):**
- Purpose: Unified button grid for all user controls (fonts, animation type, duration, colors, history)
- Location: `src/components/GridButtons.jsx`
- Pattern: Each button toggles or cycles through options via toggleItem handler
- Animated feedback: Uses Animated API for visual feedback on interactions

**PreviewWindow (Live Preview):**
- Purpose: Shows real-time preview of selected animation before full-screen flash
- Location: `src/components/PreviewWindow.jsx`
- Pattern: Mirrors animation logic from full flash screens, responsive text sizing
- Behavior: Animates 2 cycles of preview, stops after keyboard hides

**AppLoader (Bootstrap):**
- Purpose: Manages app initialization and font loading
- Location: `src/values/AppLoader.jsx`
- Pattern: Wraps Main component, prevents app render until fonts loaded
- Dependencies: expo-font, expo-splash-screen

## Entry Points

**App.jsx:**
- Location: `/Users/jackmac/Desktop/FlashTextV2/App.jsx`
- Triggers: Expo runtime launches application
- Responsibilities: Wraps Main with AppLoader, establishes component tree root

**Main.jsx (Primary Screen):**
- Location: `src/screens/Main.jsx`
- Triggers: AppLoader initialization complete
- Responsibilities:
  - Manages all application state (text, history, animation type, duration, colors, fonts)
  - Renders main UI with background image
  - Handles keyboard visibility detection
  - Manages iPad orientation changes and landscape layout
  - Renders GridButtons and PreviewWindow
  - Conditionally renders FlashScreen when user starts animation
  - Manages history modal

**FlashScreen.jsx (Animation Router):**
- Location: `src/screens/FlashScreen.jsx`
- Triggers: User presses START button in Main
- Responsibilities:
  - Routes to appropriate animation component (Plain/Swoosh/Stretch)
  - Locks/unlocks screen orientation (landscape for iPad)
  - Hides status bar during animation
  - Handles return tap to go back to Main

## Error Handling

**Strategy:** Defensive programming with fallback values

**Patterns:**
- Default props in all components (message defaults, duration defaults, color defaults)
- Safe color conversion with hex validation and luminance checks
- Font scaling with minimum/maximum bounds and fallback factors
- Async operations wrapped in try-catch (orientation locking in FlashScreen)
- Alert dialogs for user-blocking errors (no text entered, empty history)
- State bounds checking (message history capped at 50 items, color cycling wraps)

## Cross-Cutting Concerns

**Logging:** console.log used throughout (device detection, orientation changes, animation debugging)

**Validation:**
- Text input validated before starting flash (non-empty check)
- Message history filtered for duplicates
- Font selection validated against availableFonts array
- Duration capped between 500ms and 4000ms

**Authentication:** Not applicable (no backend/auth layer)

**Responsive Design:**
- Platform-specific checks (Platform.isPad, Platform.OS === 'ios')
- Dimensions.get('window') used for dynamic sizing
- iPad-specific layouts with landscape mode support
- Font scaling factors per-font for proper text sizing
- Responsive button sizing in GridButtons (IPAD_MAX_BUTTON_SIZE, etc.)
- PreviewWindow adapts dimensions based on device and orientation

**Font Management:**
- Fonts loaded upfront by AppLoader via expo-font
- Font switching via handleFontChange in Main
- Font size calculation in animation screens considers font metrics via fontScalingFactors
- 10 fonts available: Kablammo, Bubblegum, Coustard, Fascinate, Russo, Grenze, Jollylodger, Monofett, Roboto, Monoton

**State Persistence:**
- Message history maintained in Main component state for session duration
- No persistent storage implemented (cleared on app close)

---

*Architecture analysis: 2026-02-16*
