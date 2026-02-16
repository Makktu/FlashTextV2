# External Integrations

**Analysis Date:** 2026-02-16

## APIs & External Services

**Not Applicable:**
- No external APIs integrated
- No third-party web services detected
- App is self-contained with no remote API calls

## Data Storage

**Databases:**
- None - No database integration detected
- No SQLite, Firebase, Supabase, or other database service

**File Storage:**
- Local filesystem only - App data remains on device
- Custom fonts loaded from `assets/fonts/` directory
- Background images from `assets/img/` directory
- No cloud storage or file sync service

**Caching:**
- None - No explicit caching library or service

**Local Storage:**
- React component state only - No persistent storage framework detected
- Message history stored in component state via `messageHistory` state variable in `src/screens/Main.jsx`
- No AsyncStorage, localStorage, or React Native persistence library integrated

## Authentication & Identity

**Auth Provider:**
- None - No authentication system
- App is standalone with no user accounts or login
- No session management required

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service (Sentry, Bugsnag, etc.)

**Logs:**
- Console logging only - Development debugging via `console.log()` in `src/screens/Main.jsx`
- No structured logging service
- No log aggregation

**Analytics:**
- None - No analytics service (Firebase Analytics, Mixpanel, etc.)

## CI/CD & Deployment

**Hosting:**
- Apple App Store - iOS deployment target
- Google Play Store - Android deployment target
- Expo services - Build and submission via EAS (Expo Application Services)

**CI Pipeline:**
- EAS Build (Expo Application Services) - Configured in `eas.json`
  - Development builds: Internal distribution
  - Preview builds: Internal distribution
  - Production builds: Auto-increment version
- No traditional CI system detected (no GitHub Actions, Jenkins, etc.)

**Build Configuration:**
- `eas.json` specifies build profiles and submission settings
- Expo CLI version requirement: >= 13.4.2
- App version source: remote (managed via EAS)

## Environment Configuration

**Required env vars:**
- None detected - App is fully self-contained

**Secrets location:**
- No secrets management - No .env files or credential storage needed
- All configuration is static in `app.json` and `babel.config.js`

## Webhooks & Callbacks

**Incoming:**
- None - App does not expose web endpoints

**Outgoing:**
- None - App does not make external API calls

## Permissions & Capabilities

**iOS Permissions:**
- Microphone: Explicitly declared as not required in `app.json` infoPlist
- No other special permissions required
- Supports both iPhone and iPad

**Android Permissions:**
- No special permissions detected
- Adaptive icon configuration for responsive design

**Web:**
- Web deployment supported in `app.json`
- Favicon asset configured at `assets/favicon.png`

## Local Development

**Build Scripts:**
```bash
npm start              # Start Expo development server
npm run android        # Build and run Android
npm run ios            # Build and run iOS
npm run web            # Build and run web version
```

**Development Method:**
- Expo development client for testing
- Hot reload supported via Expo CLI
- No external backend required for local development

---

*Integration audit: 2026-02-16*
