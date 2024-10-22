import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

// Function to get a contrasting color for readability
const getContrastingColor = (bgColor = '#000000') => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186 ? '#000000' : '#FFFFFF';
};

const availableColors = [
  '#04eb04',
  '#0606e7',
  '#f2de07',
  '#FF4500',
  '#f203f2',
  '#000000',
];

export default function FlashPlain({
  message = ['No', 'Message', 'Passed'],
  duration = 2000,
  randomizeBgColors = false,
  userBgColor = '#000000',
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const [initialBgColor] = useState(
    randomizeBgColors ? availableColors[0] : userBgColor
  );

  const opacity = useSharedValue(1);
  const bgColor = useSharedValue(initialBgColor);
  const textColor = useSharedValue(getContrastingColor(initialBgColor));

  const screenData = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  // Calculate dynamic font size based on screen dimensions
  const calculateFontSize = (text) => {
    const minScreenDimension = Math.min(screenData.width, screenData.height);
    const availableWidth = screenData.width * 0.97; // Use 97% of the screen width for text
    let fontSize = minScreenDimension * 0.8; // Starting at 80% of the screen size
    let textWidth = text.length * (fontSize / 2); // Approximate text width

    // Adjust font size until it fits within the available width
    // while (textWidth > availableWidth) {
    //   fontSize -= 1; // Reduce font size
    //   textWidth = text.length * (fontSize / 2); // Recalculate text width
    // }
    const MIN_FONT_SIZE = 12;

    while (
      fontSize > MIN_FONT_SIZE &&
      text.length * (fontSize / 2) > availableWidth
    ) {
      fontSize -= 1;
    }

    return fontSize;
  };

  // Animated styles for opacity, background color, and text color
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedBgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
    fontSize: calculateFontSize(message[currentWord]),
  }));

  const changeWord = useCallback(() => {
    setCurrentWord((prev) => (prev + 1) % message.length);
  }, [message.length]);

  const fadeOut = useCallback(() => {
    opacity.value = withTiming(0, { duration: 500 }, () => {
      // Reset opacity back to 1 after the fade-out completes
      opacity.value = 1;
    });
  }, [opacity]);

  useEffect(() => {
    if (message.length > 0) {
      const timer = setTimeout(() => {
        fadeOut(); // Call fadeOut first
        setTimeout(changeWord, 500); // Change word after the fade-out completes
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [fadeOut, changeWord, duration, message]);

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
      <Animated.Text
        style={[styles.messageText, animatedStyle, animatedTextStyle]}
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
