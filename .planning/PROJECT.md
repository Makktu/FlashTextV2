# FlashText V3 — Dark Diamond Redesign

## What This Is

A complete visual overhaul of FlashText, transforming it from a bright, poppy glass-morphism aesthetic into a dark, polished, professional interface inspired by Linear and Vercel. The app lets users type messages and display them as full-screen animated text with customizable fonts, colors, and animation styles — now wrapped in a refined dark UI with cool blue/teal accents.

## Core Value

The flash text experience must remain fast, fluid, and delightful — the redesign elevates the surrounding UI to match the quality of the animations themselves.

## Requirements

### Validated

<!-- Existing capabilities confirmed from codebase -->

- ✓ Text input and message entry — existing
- ✓ Three animation modes: Plain (fade), Swoosh (directional slide), Stretch (scale) — existing
- ✓ Live preview window with animation cycling — existing
- ✓ 10 custom fonts (Kablammo, Bubblegum, Coustard, Fascinate, Russo, Grenze, Jollylodger, Monofett, Roboto, Monoton) — existing
- ✓ Adjustable duration (500ms–4000ms) — existing
- ✓ Background color selection with random gradient option — existing
- ✓ Message history with save/recall — existing
- ✓ Full-screen flash playback with status bar hidden — existing
- ✓ iPad landscape support and responsive layout — existing
- ✓ Tap-to-return from flash screen — existing

### Active

<!-- Current scope: Dark Diamond redesign -->

- [ ] Dark gradient background replacing background image
- [ ] Cool blue/teal accent color system throughout UI
- [ ] Redesigned text input field — dark, polished styling
- [ ] Redesigned control grid — professional, refined appearance
- [ ] Preview window as glowing focal card with subtle border glow
- [ ] Redesigned history modal — dark theme, polished interactions
- [ ] Updated typography for UI chrome (clean, modern feel while keeping all flash fonts)
- [ ] Consistent dark theme across all screens (Main, FlashScreen, Options)
- [ ] Updated shadows, borders, and depth system for dark backgrounds
- [ ] Refined spacing and layout proportions
- [ ] Updated color palette constants in values layer
- [ ] iPad layout adaptation for new design language
- [ ] Smooth visual transitions between UI states

### Out of Scope

- New animation types — not part of this redesign
- Backend/auth/persistence features — visual overhaul only
- Adding or removing fonts — keeping the full existing library
- Navigation structure changes — staying single-screen with modals
- New features or functionality — purely visual transformation
- App icon or splash screen redesign — focusing on in-app UI

## Context

FlashText is a React Native + Expo app (v51) targeting iOS, Android, and web. The current design uses a bright background image, vivid colors (#04eb04, #0606e7, #f2de07, magenta), glass-morphism effects with semi-transparent overlays, and playful UI elements. Styling is done via React Native StyleSheet with inline styles in components. Color constants live in `src/values/COLORS.js`. The app uses react-native-reanimated for animations and expo-linear-gradient for gradients.

The user wants a Linear/Vercel-inspired dark aesthetic: deep dark backgrounds, clean lines, cool blue/teal accents, subtle glow effects, and professional polish. The fun fonts stay — they're the product — but the chrome around them should feel serious and refined.

## Constraints

- **Tech stack**: React Native + Expo — no framework changes
- **Fonts**: All 10 existing fonts must remain available
- **Layout**: Single-screen flow with modals — no navigation restructure
- **Animation**: Existing animation logic untouched — visual wrapper only
- **Platforms**: Must work on iOS, Android, web, and iPad (landscape)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark gradient background (not solid, not image) | Depth without distraction — dark-to-darker gradient | — Pending |
| Cool blue/teal accent palette | Modern, trustworthy, matches Linear/Vercel reference | — Pending |
| Preview window as glowing card | Creates visual focal point on dark canvas | — Pending |
| Keep all existing fonts | Fonts are the product feature, not UI chrome | — Pending |
| Keep single-screen layout | User preference — restyle, don't restructure | — Pending |

---
*Last updated: 2026-02-16 after initialization*
