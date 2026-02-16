# Roadmap: FlashText V3 — Dark Diamond Redesign

## Overview

This roadmap transforms FlashText from a bright, glass-morphism interface into a professional dark-themed app inspired by Linear and Vercel. The journey moves from foundational theme architecture through visual redesign, component theming, polish, and platform verification. Every phase delivers observable user-facing improvements while preserving FlashText's core value: fast, fluid, delightful animated text display.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Theme Architecture** - Centralized theme system with dark mode support
- [ ] **Phase 2: Core Visual Redesign** - Dark backgrounds, surfaces, and color system applied to main screens
- [ ] **Phase 3: Component Theming** - All UI components redesigned with dark theme
- [ ] **Phase 4: Visual Polish & Interactions** - Animation polish, glow effects, and state transitions
- [ ] **Phase 5: Platform Verification** - iPad and cross-platform validation

## Phase Details

### Phase 1: Theme Architecture
**Goal**: Centralized theme infrastructure enabling all future visual work
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04
**Success Criteria** (what must be TRUE):
  1. All hard-coded color values extracted from components into centralized theme files
  2. ThemeProvider wraps app with system-aware light/dark mode detection
  3. User can toggle between light and dark themes with preference persisting across sessions
  4. All Material Design 3 Paper components render with theme-aware colors
**Plans**: TBD

Plans:
- TBD during phase planning

### Phase 2: Core Visual Redesign
**Goal**: Dark aesthetic applied to main application screens
**Depends on**: Phase 1
**Requirements**: SURF-01, SURF-02, SURF-03, POLH-01, POLH-02, POLH-05
**Success Criteria** (what must be TRUE):
  1. Main screen displays with dark gradient background (no bright background image)
  2. All text meets WCAG 4.5:1 contrast on dark backgrounds
  3. Cool blue/teal accent colors applied consistently across interactive elements
  4. PreviewWindow appears as elevated focal card with subtle visual distinction from background
  5. FlashScreen displays text with dark theme backgrounds
**Plans**: TBD

Plans:
- TBD during phase planning

### Phase 3: Component Theming
**Goal**: All UI components fully themed with dark aesthetic
**Depends on**: Phase 2
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, COMP-05
**Success Criteria** (what must be TRUE):
  1. Text input field displays with dark polished styling matching design system
  2. GridButtons control grid renders with professional refined appearance in dark theme
  3. History modal appears with dark glassmorphism effects
  4. All interactive elements show clear hover, focus, and active states in dark theme
  5. All 10 custom fonts remain readable and visually correct in dark mode
**Plans**: TBD

Plans:
- TBD during phase planning

### Phase 4: Visual Polish & Interactions
**Goal**: Refined interactions and visual effects elevate dark UI quality
**Depends on**: Phase 3
**Requirements**: POLH-03, POLH-04
**Success Criteria** (what must be TRUE):
  1. All UI state changes transition smoothly (100-300ms) without jarring visual jumps
  2. Selected and active states display inner glow effects consistently
  3. Animations maintain smooth performance (50fps minimum) during theme interactions
**Plans**: TBD

Plans:
- TBD during phase planning

### Phase 5: Platform Verification
**Goal**: Dark theme works consistently across all target platforms and screen sizes
**Depends on**: Phase 4
**Requirements**: PLAT-01, PLAT-02
**Success Criteria** (what must be TRUE):
  1. iPad landscape layout renders correctly with dark theme (no layout breakage, proper spacing)
  2. Dark theme appears visually consistent across iOS, Android, and web platforms
  3. All contrast requirements verified on actual devices in multiple lighting conditions
**Plans**: TBD

Plans:
- TBD during phase planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Theme Architecture | 0/TBD | Not started | - |
| 2. Core Visual Redesign | 0/TBD | Not started | - |
| 3. Component Theming | 0/TBD | Not started | - |
| 4. Visual Polish & Interactions | 0/TBD | Not started | - |
| 5. Platform Verification | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-16*
*Last updated: 2026-02-16*
