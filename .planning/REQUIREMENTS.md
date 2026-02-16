# Requirements: FlashText V3 — Dark Diamond Redesign

**Defined:** 2026-02-16
**Core Value:** The flash text experience must remain fast, fluid, and delightful — the redesign elevates the surrounding UI to match the quality of the animations themselves.

## v1 Requirements

Requirements for the Dark Diamond redesign. Each maps to roadmap phases.

### Theme Infrastructure

- [ ] **INFRA-01**: Extract all hard-coded colors from components into centralized theme file
- [ ] **INFRA-02**: Upgrade react-native-paper to 5.15.0 with MD3 dark theme configuration
- [ ] **INFRA-03**: Create dark theme color palette (dark gray #121212 base, cool blue/teal accents, off-white #F0F0F0 text)
- [ ] **INFRA-04**: Implement elevation system via color gradation (lighter surface tints for depth)

### Backgrounds & Surfaces

- [ ] **SURF-01**: Replace background image with dark gradient (near-black to dark blue/charcoal)
- [ ] **SURF-02**: Apply dark gray surfaces (#121212 base) across all screens (Main, FlashScreen, Options)
- [ ] **SURF-03**: Implement glassmorphism effects on modals and overlays

### Components

- [ ] **COMP-01**: Redesign PreviewWindow as glowing focal card with subtle border glow
- [ ] **COMP-02**: Redesign text input field with dark polished styling
- [ ] **COMP-03**: Redesign GridButtons control grid with refined professional appearance
- [ ] **COMP-04**: Redesign history modal with dark theme and glassmorphism
- [ ] **COMP-05**: Update all interactive elements with hover/focus/active states

### Visual Polish

- [ ] **POLH-01**: Ensure WCAG 4.5:1 text contrast across all UI text
- [ ] **POLH-02**: Apply desaturated cool blue/teal accent color consistently across interactive elements
- [ ] **POLH-03**: Implement smooth state transition animations (100-300ms) on UI interactions
- [ ] **POLH-04**: Add inner glow effects on selected/active states
- [ ] **POLH-05**: Use off-white text (#F0F0F0) instead of pure white for primary text

### Platform

- [ ] **PLAT-01**: Ensure dark theme renders correctly on iPad landscape layout
- [ ] **PLAT-02**: Verify dark theme consistency across iOS, Android, and web

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Theming

- **ADVT-01**: LCH color space dynamic color system for scalable theme generation
- **ADVT-02**: Customizable contrast levels (reduced, normal, high-contrast modes)
- **ADVT-03**: Light/dark mode toggle with system preference detection
- **ADVT-04**: Animated gradient backgrounds with performance optimization

## Out of Scope

| Feature | Reason |
|---------|--------|
| New animation types | Not part of visual redesign — functionality stays the same |
| Font library changes | Existing 10 fonts are the product — keep all |
| Navigation restructure | User preference to keep single-screen flow |
| App icon / splash screen | Focusing on in-app UI only |
| Backend / persistence | Visual overhaul only — no data layer changes |
| Pure black (#000000) backgrounds | Causes halation for 30-60% with astigmatism — use #121212 |
| Highly saturated accent colors | Vibrate and cause eye strain on dark backgrounds |
| Neon glow on every element | Overstimulation — reserve glow for focal preview card |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | — | Pending |
| INFRA-02 | — | Pending |
| INFRA-03 | — | Pending |
| INFRA-04 | — | Pending |
| SURF-01 | — | Pending |
| SURF-02 | — | Pending |
| SURF-03 | — | Pending |
| COMP-01 | — | Pending |
| COMP-02 | — | Pending |
| COMP-03 | — | Pending |
| COMP-04 | — | Pending |
| COMP-05 | — | Pending |
| POLH-01 | — | Pending |
| POLH-02 | — | Pending |
| POLH-03 | — | Pending |
| POLH-04 | — | Pending |
| POLH-05 | — | Pending |
| PLAT-01 | — | Pending |
| PLAT-02 | — | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 0
- Unmapped: 19 ⚠️

---
*Requirements defined: 2026-02-16*
*Last updated: 2026-02-16 after initial definition*
