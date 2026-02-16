# Testing Patterns

**Analysis Date:** 2026-02-16

## Test Framework

**Runner:**
- No test framework configured (Jest, Vitest, etc. not found in dependencies)
- No test scripts in `package.json`

**Assertion Library:**
- Not applicable - no testing setup

**Run Commands:**
- No test commands available in `package.json`
- Available commands:
  ```bash
  npm start              # Start Expo development server
  npm run android        # Run on Android
  npm run ios          # Run on iOS
  npm run web          # Run on web
  ```

## Test File Organization

**Location:**
- No test files detected in codebase
- Only one test file found outside source: `/Users/jackmac/Desktop/FlashTextV2/.claude/get-shit-done/bin/gsd-tools.test.cjs` (not part of main application)

**Naming:**
- N/A - no test files in application code

**Structure:**
- N/A - no test files in application code

## Test Structure

**Suite Organization:**
- Not applicable - no test framework configured

**Patterns:**
- No test setup or teardown patterns observed
- No assertion patterns implemented
- Manual testing appears to be the current approach

## Mocking

**Framework:**
- Not applicable - no testing framework

**Patterns:**
- No mock implementations observed

**What to Mock:**
- Not applicable

**What NOT to Mock:**
- Not applicable

## Fixtures and Factories

**Test Data:**
- No test fixtures implemented
- Hard-coded default values used in components for testing (e.g., `message = ['no', 'message', 'was', 'passed']` in `FlashScreen.jsx`)

**Location:**
- Test data embedded directly in component default props

## Coverage

**Requirements:**
- No coverage requirements enforced
- No coverage tool configured

**View Coverage:**
- No coverage tool available

## Test Types

**Unit Tests:**
- Not implemented
- Candidates for unit testing:
  - `getFlashScreenDimensions()` in `src/utils/screenDimensions.js` - dimension calculation logic
  - `getContrastingColor()` used in multiple flash screens - color contrast calculation
  - `calculateFontSize()` in flash screen components - complex font sizing logic with multiple factors
  - `calculateTextSize()` in `PreviewWindow.jsx` - responsive text sizing

**Integration Tests:**
- Not implemented
- Candidates for integration testing:
  - Animation sequences in `PreviewWindow.jsx` with state management
  - Orientation locking workflow in `FlashScreen.jsx`
  - Font loading and caching in `AppLoader.jsx`
  - Message history persistence in `Main.jsx`

**E2E Tests:**
- Not implemented
- Detox or similar tool not configured

## Common Patterns

**Async Testing:**
- No async testing patterns implemented
- Async patterns in code (orientation changes, font loading) not covered by tests
- Example async operation without test coverage in `Main.jsx`:
  ```javascript
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      } catch (error) {
        console.error('Failed to lock orientation:', error);
      }
    };
    lockOrientation();
  }, []);
  ```

**Error Testing:**
- No error test patterns
- Error handling exists but untested (try-catch blocks in orientation changes)

## Testing Recommendations

**Priority Areas for Testing:**

1. **High Priority:**
   - Font sizing algorithms (`calculateFontSize()`) - complex business logic with multiple factors
   - Device detection and dimension calculations (`getFlashScreenDimensions()`) - critical for responsive behavior
   - Orientation locking workflow - platform-specific and error-prone
   - Animation state management in `PreviewWindow.jsx` - complex animation orchestration

2. **Medium Priority:**
   - Color contrast calculation (`getContrastingColor()`) - affects readability
   - Message history management in `Main.jsx` - data persistence logic
   - Font loading sequence in `AppLoader.jsx`

3. **Low Priority:**
   - Simple UI components like `MyButton.jsx` - minimal logic
   - Style calculations - more easily validated visually

**Suggested Testing Setup:**
- Jest for unit testing (standard React Native choice)
- React Native Testing Library for component testing
- Detox for E2E testing mobile animations

---

*Testing analysis: 2026-02-16*
