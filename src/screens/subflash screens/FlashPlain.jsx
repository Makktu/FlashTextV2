import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { fontScalingFactors } from '../../values/fontScalingFactors';
import availableColors from '../../values/COLORS';
import { getFlashScreenDimensions } from '../../utils/screenDimensions';

const getContrastingColor = (bgColor = '#000000') => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186 ? '#000000' : '#FFFFFF';
};

export default function FlashPlain({
  message = ['No', 'Message', 'Passed'],
  duration = 2000,
  randomizeBgColor = false,
  userBgColor = '#000000',
  userFont = 'Roboto',
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const opacity = useSharedValue(1);
  const [fontSize, setFontSize] = useState(30);
  const bgColor = useSharedValue(
    randomizeBgColor ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));
  const isComponentMounted = useSharedValue(true);

  console.log(userFont);

  const calculateFontSize = useCallback(
    (text) => {
      const screenData = getFlashScreenDimensions();
      
      // Calculate available width based on device and orientation
      const widthFactor = screenData.isPad
        ? (screenData.isLandscape ? 0.95 : 0.95)  // Increased iPad utilization
        : (screenData.isLandscape ? 0.92 : 0.95); // Increased width utilization
      
      const availableWidth = screenData.width * widthFactor;
      const MIN_FONT_SIZE = 20; // Increased minimum font size

      // Calculate max font size based on screen dimensions and orientation
      const MAX_FONT_SIZE = screenData.isLandscape
        ? screenData.height * 0.65  // Significantly increased for landscape
        : screenData.width * (screenData.isPad ? 0.25 : 0.3); // Increased for portrait

      // Get the scaling factor for the current font
      const fontScale = (fontScalingFactors[userFont] || fontScalingFactors.default) * 0.65; // Reduced font scale factor

      // Calculate initial font size with improved scaling
      let newFontSize = Math.min(
        (availableWidth / (text.length * fontScale)) * 
        (screenData.isLandscape ? 1.3 : 1.1) * // Increased multipliers
        (text.length <= 3 ? 1.3 : 
         text.length <= 5 ? 1.2 : 
         text.length <= 8 ? 1.1 : 1), // Progressive boost for shorter words
        MAX_FONT_SIZE
      );

      // Ensure font size is not smaller than minimum
      newFontSize = Math.max(MIN_FONT_SIZE, Math.floor(newFontSize));

      return newFontSize;
    },
    [userFont]
  );

  // Update font size when word changes
  useEffect(() => {
    const newSize = calculateFontSize(message[currentWord]);
    setFontSize(newSize);
  }, [currentWord, message, calculateFontSize]);

  // Reset all animations and states when unmounting
  useEffect(() => {
    isComponentMounted.value = true;
    return () => {
      isComponentMounted.value = false;
      opacity.value = 1;
      bgColor.value = userBgColor;
      textColor.value = getContrastingColor(userBgColor);
      setCurrentWord(0);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedBgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  const changeWord = useCallback(() => {
    setCurrentWord((prev) => (prev + 1) % message.length);
  }, [message.length]);

  const animateBackgroundColor = useCallback(() => {
    if (!isComponentMounted.value) return;

    if (randomizeBgColor) {
      const newColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      bgColor.value = withTiming(newColor, { duration: duration / 4 });
      textColor.value = withTiming(getContrastingColor(newColor), {
        duration: duration / 4,
      });
    }
  }, [randomizeBgColor, bgColor, textColor, duration, isComponentMounted]);

  const animate = useCallback(() => {
    if (!isComponentMounted.value) return;

    opacity.value = withTiming(0, { duration: duration / 4 }, (finished) => {
      if (finished && isComponentMounted.value) {
        runOnJS(changeWord)();
        opacity.value = withTiming(1, { duration: duration / 4 });
      }
    });
  }, [opacity, duration, changeWord, isComponentMounted]);

  useEffect(() => {
    let timerId;

    if (isComponentMounted.value) {
      timerId = setTimeout(() => {
        if (isComponentMounted.value) {
          animateBackgroundColor();
          animate();
        }
      }, duration);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [animate, animateBackgroundColor, duration, currentWord, isComponentMounted]);

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
      <Animated.Text
        style={[
          styles.messageText,
          { fontSize, fontFamily: userFont },
          animatedStyle,
          animatedTextStyle,
        ]}
        numberOfLines={1}
      >
        {message[currentWord]}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontWeight: 'bold',
  },
});
