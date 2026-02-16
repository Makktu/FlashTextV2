# Technology Stack

**Analysis Date:** 2026-02-16

## Languages

**Primary:**
- JavaScript (ES6+) - All source code in `src/`
- JSX - Used for React Native components

**Secondary:**
- JSON - Configuration and asset definitions

## Runtime

**Environment:**
- React Native 0.74.5 - Core mobile runtime via Expo

**Package Manager:**
- npm - Primary package manager
- Lockfile: `package-lock.json` (present)
- Node.js: No explicit version specified in package.json

## Frameworks

**Core:**
- Expo ~51.0.28 - React Native framework and build system
- React 18.2.0 - Component library and state management
- React Native 0.74.5 - Native mobile framework

**Navigation:**
- @react-navigation/native ^6.1.18 - Core navigation
- @react-navigation/bottom-tabs ^6.6.1 - Tab-based navigation
- @react-navigation/native-stack ^6.11.0 - Stack-based navigation
- @react-navigation/stack ^6.4.1 - Additional stack navigation utilities

**UI Components:**
- react-native-paper ^5.12.5 - Material Design components and PaperProvider
- react-native-vector-icons ^10.2.0 - Icon library for UI elements

**Animation & Interactions:**
- react-native-reanimated ~3.10.1 - Advanced animation library
- react-native-gesture-handler ~2.16.1 - Touch and gesture detection
- expo-linear-gradient ^13.0.2 - Linear gradient effects
- react-native-linear-gradient ^2.8.3 - Alternative gradient support

**Fonts & Display:**
- expo-font ~12.0.10 - Custom font loading from `assets/fonts/`
- expo-splash-screen ~0.27.6 - Splash screen management

**Platform-Specific:**
- expo-screen-orientation ~7.0.5 - Device orientation detection and locking
- expo-status-bar ~1.12.1 - Status bar control

**Safe Area:**
- react-native-safe-area-context 4.10.5 - Safe area inset management
- react-native-screens 3.31.1 - Native screen containers

**Build/Dev:**
- Babel ^7.20.0 - JavaScript transpilation
- babel-preset-expo - Expo-specific Babel presets
- Babel plugin: react-native-reanimated/plugin - Reanimated compilation

## Key Dependencies

**Critical:**
- react-native-reanimated - Enables high-performance animations used throughout the app
- @react-navigation packages - Provides routing and screen management
- expo - Build system and native module bridge

**Infrastructure:**
- expo-font - Used to load custom fonts (Kablammo, Bubblegum, Coustard, Fascinate, Russo, Grenze, JollyLodger, Monofett, Roboto, Monoton) from `assets/fonts/`
- expo-screen-orientation - Critical for controlling device orientation behavior
- react-native-paper - Provides Material Design PaperProvider wrapper at root level in `src/screens/Main.jsx`

## Configuration

**Environment:**
- No .env file detected - app is self-contained with no external service dependencies
- Configuration via `app.json` for Expo-specific settings

**Build:**
- `babel.config.js` - Babel transpilation configuration with reanimated plugin
- `eas.json` - Expo Application Services build configuration
  - Development builds supported
  - Preview and production distributions configured
  - Auto-increment for production builds
- `app.json` - Expo app metadata and plugin configuration
  - App name: FlashText
  - Slug: flashtext
  - Version: 2.0.0
  - Bundle ID (iOS): com.flashtext.mcnamara
  - Expo plugin: expo-font

## Platform Requirements

**Development:**
- macOS (current development environment)
- Expo CLI (via npm scripts)
- iOS/Android simulators or physical devices for testing

**Production:**
- **iOS:** Deployment via App Store
  - Bundle ID: com.flashtext.mcnamara
  - Supports tablets (supportsTablet: true)
  - Build number: 7
  - Microphone permission declared but not used
- **Android:** Deployment via Google Play
  - Adaptive icon configuration for multiple densities
  - Background color: #ffffff
- **Web:** Optional web deployment with favicon support

---

*Stack analysis: 2026-02-16*
