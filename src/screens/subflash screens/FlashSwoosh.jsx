import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';
import { fontScalingFactors } from '../../values/fontScalingFactors';
import availableColors from '../../values/COLORS';
import { getFlashScreenDimensions } from '../../utils/screenDimensions';

// Function to get a contrasting color for readability
const getContrastingColor = (bgColor) => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186 ? '#000000' : '#FFFFFF';
};

// Function to get random color different from the last one
const getRandomColor = (previousColor) => {
  let newColor;
  do {
    newColor =
      availableColors[Math.floor(Math.random() * availableColors.length)];
  } while (newColor === previousColor);
  return newColor;
};

// Function to get random direction different from the last one
const getRandomDirection = (previousDirection) => {
  const directions = ['left-right', 'right-left', 'top-bottom', 'bottom-top'];
  let newDirection;
  do {
    newDirection = directions[Math.floor(Math.random() * directions.length)];
  } while (newDirection === previousDirection);
  return newDirection;
};

export default function FlashSwoosh({
  message,
  duration = 2000,
  randomizeBgColor = false,
  userBgColor = '#000000',
  swooshDirection = 'top-bottom',
  userFont = 'Arial',
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const position = useSharedValue({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(30);
  const bgColor = useSharedValue(
    randomizeBgColor ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));

  const calculateFontSize = useCallback(
    (text) => {
      const screenData = getFlashScreenDimensions();
      
      // Calculate available width based on device and orientation
      const widthFactor = screenData.isPad
        ? (screenData.isLandscape ? 0.7 : 0.8)  // iPad uses more conservative width
        : (screenData.isLandscape ? 0.8 : 0.9); // Other devices
      
      const availableWidth = screenData.width * widthFactor;
      const MIN_FONT_SIZE = 12;

      // Calculate max font size based on screen dimensions and orientation
      const MAX_FONT_SIZE = screenData.isLandscape
        ? screenData.height * 0.4  // Use height for landscape to ensure text fills vertical space
        : screenData.width * (screenData.isPad ? 0.15 : 0.2);

      // Get the scaling factor for the current font
      const fontScale = fontScalingFactors[userFont] || fontScalingFactors.default;

      // Calculate initial font size based on available width and text length
      let newFontSize = Math.min(
        (availableWidth / (text.length * fontScale)) * (screenData.isLandscape ? 1.5 : 1),
        MAX_FONT_SIZE
      );

      // Ensure font size is not smaller than minimum
      newFontSize = Math.max(MIN_FONT_SIZE, newFontSize);

      return Math.floor(newFontSize);
    },
    [userFont]
  );

  useEffect(() => {
    // Cleanup function to reset animations when component unmounts
    return () => {
      position.value = { x: 0, y: 0 };
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value.x },
      { translateY: position.value.y },
    ],
    opacity: 1,
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

  const animateBackgroundColor = useCallback(
    (previousColor) => {
      if (randomizeBgColor) {
        const newColor = getRandomColor(previousColor);
        bgColor.value = withTiming(newColor, { duration: duration / 4 });
        textColor.value = withTiming(getContrastingColor(newColor), {
          duration: duration / 4,
        });
        return newColor;
      }
      return previousColor;
    },
    [randomizeBgColor, bgColor, textColor, duration]
  );

  const animateSwoosh = useCallback(
    (prevDirection) => {
      const direction =
        swooshDirection === 'random'
          ? getRandomDirection(prevDirection)
          : swooshDirection;

      let start, middle, end;
      const screenData = getFlashScreenDimensions();
      switch (direction) {
        case 'left-right':
          start = { x: -screenData.width, y: 0 };
          middle = { x: 0, y: 0 };
          end = { x: screenData.width, y: 0 };
          break;
        case 'right-left':
          start = { x: screenData.width, y: 0 };
          middle = { x: 0, y: 0 };
          end = { x: -screenData.width, y: 0 };
          break;
        case 'top-bottom':
          start = { x: 0, y: -screenData.height };
          middle = { x: 0, y: 0 };
          end = { x: 0, y: screenData.height };
          break;
        case 'bottom-top':
          start = { x: 0, y: screenData.height };
          middle = { x: 0, y: 0 };
          end = { x: 0, y: -screenData.height };
          break;
      }

      position.value = withSequence(
        withTiming(start, { duration: 0 }),
        withTiming(middle, { duration: duration / 2 }),
        withTiming(end, { duration: duration / 2 })
      );

      return direction;
    },
    [position, duration, swooshDirection]
  );

  useEffect(() => {
    let lastDirection = swooshDirection;
    let lastColor = userBgColor;

    const interval = setInterval(() => {
      lastColor = animateBackgroundColor(lastColor);
      lastDirection = animateSwoosh(lastDirection);
      changeWord();
    }, duration);

    return () => clearInterval(interval);
  }, [
    animateBackgroundColor,
    animateSwoosh,
    changeWord,
    duration,
    swooshDirection,
    userBgColor,
  ]);

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
      <Animated.Text
        style={[
          animatedStyle,
          animatedTextStyle,
          {
            fontSize: calculateFontSize(message[currentWord]),
            fontFamily: userFont,
          },
        ]}
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
