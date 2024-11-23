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
      const minScreenDimension = Math.min(screenData.width, screenData.height);
      const availableWidth = screenData.width * 0.9;
      const MIN_FONT_SIZE = 12;

      const fontScale =
        fontScalingFactors[userFont] || fontScalingFactors.default;

      let newFontSize = minScreenDimension * 0.6;

      while (
        newFontSize > MIN_FONT_SIZE &&
        text.length * (newFontSize / 2) * fontScale > availableWidth
      ) {
        newFontSize -= 1;
      }

      return Math.floor(newFontSize / fontScale);
    },
    [userFont]
  );

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
