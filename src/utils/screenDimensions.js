import { Dimensions, Platform } from 'react-native';

export const getFlashScreenDimensions = () => {
  const window = Dimensions.get('window');
  
  if (Platform.isPad) {
    // On iPad, always return dimensions as if in landscape
    return {
      width: Math.max(window.width, window.height),
      height: Math.min(window.width, window.height)
    };
  }
  
  // For other devices, return actual dimensions
  return {
    width: window.width,
    height: window.height
  };
};
