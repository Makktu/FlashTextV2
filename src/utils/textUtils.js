import { Dimensions, Platform } from 'react-native';

export const getFlashScreenDimensions = () => {
  // Use native module to get real screen metrics
  const screen = Dimensions.get('screen');
  const window = Dimensions.get('window');
  
  // Account for safe areas and navigation bars
  const width = Math.min(screen.width, window.width);
  const height = Math.min(screen.height, window.height);
  
  return {
    width,
    height,
    isPad: Platform.isPad,
    isLandscape: width > height,
    // Add viewport units for easier calculations
    vw: width / 100,
    vh: height / 100,
    vmin: Math.min(width, height) / 100,
    vmax: Math.max(width, height) / 100
  };
};

export const calculateFontSize = (text, userFont, fontScalingFactors) => {
  const screenData = getFlashScreenDimensions();
  
  // Calculate base size from screen width
  // Use a higher percentage of screen width (85%)
  const targetWidth = screenData.width * 0.85;
  
  // Estimate characters that can fit at base size
  // Assume average character is roughly square-ish
  const estimatedCharWidth = targetWidth / text.length;
  
  // Initial font size based on estimated character width
  // Multiply by font-specific adjustment
  const fontAdjustment = fontScalingFactors[userFont] || 1;
  let fontSize = estimatedCharWidth * (fontAdjustment * 1.2); // Increased base multiplier
  
  // Apply length-based adjustments
  if (text.length <= 3) {
    fontSize *= 1.4; // Boost very short words more
  } else if (text.length <= 5) {
    fontSize *= 1.2; // Boost short words
  } else if (text.length > 10) {
    fontSize *= 0.9; // Slight reduction for very long words
  }
  
  // Enforce min/max bounds
  const minFontSize = screenData.isPad ? 30 : 24; // Increased minimum sizes
  const maxFontSize = screenData.height * 0.8; // Allow larger maximum size
  
  return Math.floor(Math.min(Math.max(fontSize, minFontSize), maxFontSize));
};
