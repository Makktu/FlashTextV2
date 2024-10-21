import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';

const getContrastingColor = (bgColor) => {
  try {
    const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 186 ? '#000000' : '#FFFFFF';
  } catch (error) {
    console.error('Error parsing color:', error);
    return '#FFFFFF'; // Default to white on error
  }
};

const availableColors = ['#006400', '#00008B', '#8B8000', '#FF4500', '#8B008B'];

export default function FlashPlain({
  message = [],
  duration = 2000,
  randomizeBgColor = false,
  userBgColor = '#000000',
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const opacity = useSharedValue(1);
  const bgColor = useSharedValue(
    randomizeBgColor ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));

  const screenData = useMemo(() => {
    try {
      return {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      };
    } catch (error) {
      console.error('Error getting dimensions:', error);
      return { width: 300, height: 500 }; // Fallback values
    }
  }, []);

  const calculateFontSize = useCallback(
    (word) => {
      if (!word) return 30; // Default font size
      const wordLength = word.length;
      const maxWidth = screenData.width * 0.9;
      const maxHeight = screenData.height * 0.9;
      const desiredFontSizeByWidth = maxWidth / wordLength;
      const desiredFontSizeByHeight = maxHeight / 2;
      return Math.min(desiredFontSizeByWidth, desiredFontSizeByHeight, 100); // Cap at 100 to prevent excessive sizes
    },
    [screenData]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedBgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
    fontSize: calculateFontSize(message[currentWord] || ''),
  }));

  const changeWord = useCallback(() => {
    if (message.length > 0) {
      setCurrentWord((prev) => (prev + 1) % message.length);
    }
  }, [message]);

  const animateBackgroundColor = useCallback(() => {
    const newColor =
      availableColors[Math.floor(Math.random() * availableColors.length)];
    bgColor.value = withTiming(newColor, { duration: duration / 4 });
    textColor.value = withTiming(getContrastingColor(newColor), {
      duration: duration / 4,
    });
  }, [bgColor, textColor, duration]);

  const animateFade = useCallback(() => {
    opacity.value = withSequence(
      withTiming(0, { duration: duration / 4 }),
      withTiming(1, { duration: duration / 4 }),
      withTiming(1, { duration: duration / 4 }),
      withTiming(0, { duration: duration / 4 })
    );
  }, [opacity, duration]);

  useEffect(() => {
    if (message.length > 0) {
      if (randomizeBgColor) {
        animateBackgroundColor();
      }
      animateFade();
      const timer = setTimeout(changeWord, duration);
      return () => clearTimeout(timer);
    }
  }, [
    animateBackgroundColor,
    animateFade,
    changeWord,
    duration,
    currentWord,
    message,
    randomizeBgColor,
  ]);

  if (message.length === 0) {
    return <Text style={styles.errorText}>No message provided</Text>;
  }

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
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
