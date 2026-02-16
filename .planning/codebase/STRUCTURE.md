# Codebase Structure

**Analysis Date:** 2026-02-16

## Directory Layout

```
/Users/jackmac/Desktop/FlashTextV2/
├── App.jsx                          # Root component entry point
├── package.json                     # Project dependencies and metadata
├── app.json                         # Expo configuration
├── babel.config.js                  # Babel configuration
├── eas.json                         # EAS (Expo Application Services) config
├── assets/                          # Static assets
│   ├── fonts/                       # Custom TTF font files (10 fonts)
│   ├── img/                         # Background images
│   └── icon.png, splash.png        # App branding assets
├── src/                             # Source code
│   ├── screens/                     # Full-screen components (navigation targets)
│   │   ├── Main.jsx                 # Primary UI screen with state management
│   │   ├── FlashScreen.jsx          # Animation orchestrator/router
│   │   ├── Options.jsx              # (Unused/deprecated options screen)
│   │   ├── ScrollMessage.jsx        # (Unused/deprecated message screen)
│   │   └── subflash screens/        # Animation implementations
│   │       ├── FlashPlain.jsx       # Simple fade animation
│   │       ├── FlashSwoosh.jsx      # Directional swoosh animation
│   │       └── FlashStretch.jsx     # Vertical scale animation
│   ├── components/                  # Reusable UI components
│   │   ├── GridButtons.jsx          # 2x3 control grid (fonts, type, duration, colors, history, start)
│   │   ├── PreviewWindow.jsx        # Live animation preview panel
│   │   ├── FlashMessage.jsx         # (Appears unused)
│   │   ├── WordStage.jsx            # (Appears unused)
│   │   ├── TextTransition.jsx       # (Appears unused)
│   │   ├── FontSelector.jsx         # (Appears unused)
│   │   ├── InputBox.jsx             # (Appears unused)
│   │   └── MyButton.jsx             # (Appears unused)
│   ├── values/                      # Configuration and constants
│   │   ├── AppLoader.jsx            # Font loading and app initialization
│   │   ├── COLORS.js                # Color palette (7 colors)
│   │   └── fontScalingFactors.js    # Per-font sizing metrics
│   └── utils/                       # Helper utilities
│       └── screenDimensions.js      # Device detection and dimension calculations
└── .planning/
    └── codebase/                    # Analysis documents (this document)
```

## Directory Purposes

**src/screens/:**
- Purpose: Full-screen components that represent distinct app states
- Contains: Main navigation views and animation display screens
- Key files: Main.jsx (app hub), FlashScreen.jsx (animation coordinator)
- Note: Some screens (Options.jsx, ScrollMessage.jsx) appear deprecated

**src/screens/subflash screens/:**
- Purpose: Animation effect implementations
- Contains: Three animation variants (Plain, Swoosh, Stretch) using react-native-reanimated
- Key files: FlashPlain.jsx, FlashSwoosh.jsx, FlashStretch.jsx
- Pattern: Each receives message array and configuration, animates words sequentially

**src/components/:**
- Purpose: Reusable UI components
- Contains: Interactive controls, preview displays, and deprecated components
- Key active files: GridButtons.jsx, PreviewWindow.jsx
- Note: Several components (FontSelector, InputBox, MyButton, etc.) are not imported/used

**src/values/:**
- Purpose: Centralized constants, configuration, and initialization
- Contains: Color definitions, font metrics, font loading logic
- Key files: COLORS.js (7-item color array), fontScalingFactors.js (font-specific sizing multipliers)

**src/utils/:**
- Purpose: Helper functions for calculations and device detection
- Contains: Screen dimension utilities and responsive sizing logic
- Key files: screenDimensions.js (returns device type, orientation, and dimension calculations)

**assets/:**
- Purpose: Static application resources
- Contains: 10 custom TTF fonts, background images, app icons
- Structure: fonts/ subdirectory, img/ subdirectory for images

## Key File Locations

**Entry Points:**
- `App.jsx`: Application root - wraps Main with AppLoader for font initialization
- `src/screens/Main.jsx`: Primary user interface - state management hub and UI rendering

**Configuration:**
- `app.json`: Expo platform configuration (bundle ID, iOS/Android settings, splash screen)
- `package.json`: Dependencies and npm scripts (start, android, ios, web)
- `babel.config.js`: Babel preset and react-native-reanimated plugin configuration

**Core Logic:**
- `src/screens/Main.jsx`: Application state (text, history, flash type, duration, colors, fonts)
- `src/screens/FlashScreen.jsx`: Animation type routing and screen management
- `src/screens/subflash screens/FlashPlain.jsx`: Plain fade animation implementation
- `src/screens/subflash screens/FlashSwoosh.jsx`: Swoosh directional animation
- `src/screens/subflash screens/FlashStretch.jsx`: Vertical scaling animation

**Components:**
- `src/components/GridButtons.jsx`: Control interface for all user settings
- `src/components/PreviewWindow.jsx`: Live preview of selected animation

**Utilities:**
- `src/values/AppLoader.jsx`: Font loading wrapper component
- `src/values/COLORS.js`: 7-color palette used throughout app
- `src/values/fontScalingFactors.js`: Font-specific sizing metrics
- `src/utils/screenDimensions.js`: Device detection and dimension calculations

## Naming Conventions

**Files:**
- Screen components: PascalCase with .jsx extension (Main.jsx, FlashScreen.jsx)
- Utility modules: camelCase with .js extension (fontScalingFactors.js)
- Component files: PascalCase with .jsx extension (GridButtons.jsx, PreviewWindow.jsx)
- Constants/values: UPPERCASE or camelCase (COLORS.js, AppLoader.jsx)

**Directories:**
- Component directories: lowercase plural with spaces (subflash screens/)
- Feature directories: lowercase plural (screens/, components/, utils/, values/)

**Functions/Variables:**
- State hooks: camelCase (currentScreen, flashType, userFont)
- Event handlers: camelCase with Handle prefix (handleInput, handleFontChange, handleHistoryPress)
- Callbacks: camelCase with on prefix (onStartPress, onFontChange, onHistoryPress)
- Constants: camelCase or UPPERCASE (isIPad, plainBtnAnimSpeed, PREVIEW_WIDTH)

**Component Props:**
- Boolean/flag props: camelCase prefix with is/has (hasText, isKeyboardVisible, isPad)
- Callback props: camelCase with on prefix (onPress, onStartPress, toggleItem)
- Data props: descriptive camelCase (message, duration, userFont, userBgColor)

## Where to Add New Code

**New Animation Type:**
- Create file: `src/screens/subflash screens/Flash[TypeName].jsx`
- Copy pattern from FlashPlain.jsx or FlashSwoosh.jsx
- Export component expecting props: message, duration, userBgColor, randomizeBgColor, userFont
- Add type string case to FlashScreen.jsx conditional render (lines 61-88)
- Add type option to GridButtons.jsx row 2 animation buttons

**New Control Button:**
- Add to GridButtons.jsx row layout (rows at lines 192-406)
- Create state variable in Main.jsx for button state
- Add toggleItem case in Main.jsx toggleItem function (lines 242-295)
- Wire prop to GridButtons: pass state variable and toggle handler
- Update button logic in GridButtons to call handler

**New Component:**
- Create file: `src/components/[ComponentName].jsx`
- Follow component pattern from PreviewWindow.jsx or GridButtons.jsx
- Import in Main.jsx if needed for display
- Use consistent prop naming (on* for callbacks, is* for booleans)

**New Utility Function:**
- Create or expand file in `src/utils/`
- Export named functions
- Use consistent naming (getFlashScreenDimensions pattern)
- Add JSDoc comments for public functions

**New Configuration/Constant:**
- Colors: add to availableColors array in `src/values/COLORS.js`
- Fonts: add TTF file to `assets/fonts/`, add to useFonts in AppLoader.jsx, add to fontScalingFactors.js
- Responsive dimensions: add to getFlashScreenDimensions in screenDimensions.js

## Special Directories

**assets/fonts/:**
- Purpose: Custom font files for text rendering
- Generated: No (manually added TTF files)
- Committed: Yes
- Contents: 10 custom TTF fonts (Kablammo, Bubblegum, Coustard, Fascinate, Russo, Grenze, Jollylodger, Monofett, Roboto, Monoton)
- Usage: Loaded by AppLoader.jsx, configurable in Main.jsx

**assets/img/:**
- Purpose: Background images for UI
- Generated: No
- Committed: Yes
- Contents: Background images (flashtext_bg1.jpg through flashtext_bg9.jpg referenced)
- Usage: Background image in Main.jsx (currently using flashtext_bg1.jpg as require in Main)

**.expo/:**
- Purpose: Expo development configuration
- Generated: Yes (created by Expo CLI)
- Committed: No (.expo typically in .gitignore)
- Contents: Device tracking, development server data

**.planning/codebase/:**
- Purpose: Code analysis and planning documents
- Generated: Yes (created by GSD mapping commands)
- Committed: Yes
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md

## Recommended File Organization for New Features

**Adding a new screen:**
```
src/screens/NewScreen.jsx          # New screen component
```

**Adding a new section to main UI:**
```
src/components/NewSection.jsx      # Reusable component for that section
src/values/newSectionConfig.js     # Any specific configuration needed
```

**Adding a new animation type:**
```
src/screens/subflash screens/FlashNewType.jsx    # Animation implementation
Update FlashScreen.jsx                            # Add routing
Update GridButtons.jsx                            # Add option (if needed)
```

---

*Structure analysis: 2026-02-16*
