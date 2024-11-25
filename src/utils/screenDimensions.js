import { Dimensions, Platform } from 'react-native';

export const getFlashScreenDimensions = () => {
  const window = Dimensions.get('window');
  const isLandscape = window.width > window.height;
  
  return {
    width: window.width,
    height: window.height,
    isPad: Platform.isPad,
    isLandscape,
    aspectRatio: window.width / window.height
  };
};
