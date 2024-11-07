import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';
import { fontScalingFactors } from '../../values/fontScalingFactors';
import availableColors from '../../values/COLORS';

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
  const opacity = useSharedValue(1);
  const bgColor = useSharedValue(userBgColor);
  const textColor = useSharedValue(getContrastingColor(bgColor.value));

  const [screenData, setScreenData] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  console.log(randomizeBgColor);

  // Listener for screen orientation changes (detect screen rotation)
  useEffect(() => {
    const onChange = () => {
      setScreenData({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      });
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => {
      subscription?.remove(); // Correctly remove the event listener
    };
  }, []);

  // Calculate dynamic font size based on screen dimensions
  const calculateFontSize = useCallback(
    (text) => {
      const screenData = {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      };

      const minScreenDimension = Math.min(screenData.width, screenData.height);
      const availableWidth = screenData.width * 0.9; // Reduced from 0.97 to provide more margin
      const MIN_FONT_SIZE = 12;

      // Get the scaling factor for the current font
      const fontScale =
        fontScalingFactors[userFont] || fontScalingFactors.default;

      // Start with a smaller initial font size
      let newFontSize = minScreenDimension * 0.6; // Reduced from 0.8

      // Apply the font scaling factor to the calculation
      while (
        newFontSize > MIN_FONT_SIZE &&
        text.length * (newFontSize / 2) * fontScale > availableWidth
      ) {
        newFontSize -= 1;
      }

      // Apply an additional safety margin for certain fonts
      return Math.floor(newFontSize / fontScale);
    },
    [userFont]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value.x },
      { translateY: position.value.y },
    ],
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

  const animateBackgroundColor = useCallback(
    (previousColor) => {
      if (randomizeBgColor) {
        const newColor = getRandomColor(previousColor);
        bgColor.value = withTiming(newColor, { duration: duration / 4 });
        textColor.value = withTiming(getContrastingColor(newColor), {
          duration: duration / 4,
        });
        return newColor; // Return the new color to store locally
      }
      return previousColor; // If not random, keep the same color
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

      opacity.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: duration / 4 }),
        withTiming(1, { duration: duration / 2 }),
        withTiming(0, { duration: duration / 4 })
      );

      return direction; // Return the new direction to store locally
    },
    [position, opacity, screenData, duration, swooshDirection]
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
          }, // Calculate font size for current word
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
