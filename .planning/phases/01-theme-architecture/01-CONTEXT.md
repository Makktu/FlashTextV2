# Phase 1: Theme Architecture - Context

**Gathered:** 2026-02-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Centralized theme infrastructure: extract all hard-coded colors into theme tokens, create a ThemeProvider with light/dark/system mode support, persist user preference, and ensure all Material Design 3 Paper components render theme-aware. This phase builds the foundation — actual visual redesign of screens and components happens in later phases.

</domain>

<decisions>
## Implementation Decisions

### Dark theme palette
- Primary background: dark gray (#1A1A2E range) — not true black, allows visible depth layers
- Tone: warm charcoal undertone — softer, approachable feel rather than cold/techy
- Accent color family: amber/gold for interactive elements (buttons, links, selections)
- Surface elevation levels: Claude's discretion based on app needs

### Light/dark switching
- Three-option system: Light / Dark / System (follows device setting)
- Toggle location: header/toolbar — always visible, quick access
- Transition: quick crossfade (~200ms) between themes — feels polished, not jarring
- Light theme treatment: muted/neutral — tone down current bright glass-morphism to softer whites for coherence with the new dark theme
- System mode behavior: picks up system theme changes on next app open/foreground, not live

### Persistence & defaults
- Default on first launch: dark mode (hero of the redesign)
- Storage: AsyncStorage (device-local) — simple, works offline
- Flash text screen: follows current theme — consistent experience across the entire app

### Claude's Discretion
- Number of surface elevation levels (2 vs 3) based on component hierarchy needs
- Exact hex values within the warm charcoal and amber/gold families
- Loading/splash screen theme behavior
- Exact crossfade implementation approach

</decisions>

<specifics>
## Specific Ideas

- Inspired by Linear and Vercel's dark aesthetic but with warm undertones instead of cool
- Amber/gold accents create a distinctive identity — not the typical blue tech look
- Light theme should feel like a companion to dark, not a separate design — shared token structure, just different values

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-theme-architecture*
*Context gathered: 2026-02-16*
