import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { fontScalingFactors } from '../../values/fontScalingFactors';
import availableColors from '../../values/COLORS';

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
  const [fontSize, setFontSize] = useState(30);
  const opacity = useSharedValue(1);
  const bgColor = useSharedValue(
    randomizeBgColor ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));

  console.log(userFont);

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

  // Update font size when word changes
  useEffect(() => {
    const newSize = calculateFontSize(message[currentWord]);
    setFontSize(newSize);
  }, [currentWord, message, calculateFontSize]);

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
    if (randomizeBgColor) {
      const newColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      bgColor.value = withTiming(newColor, { duration: duration / 4 });
      textColor.value = withTiming(getContrastingColor(newColor), {
        duration: duration / 4,
      });
    }
  }, [randomizeBgColor, bgColor, textColor, duration]);

  const animate = useCallback(() => {
    opacity.value = withTiming(0, { duration: duration / 4 }, (finished) => {
      if (finished) {
        runOnJS(changeWord)();
        opacity.value = withTiming(1, { duration: duration / 4 });
      }
    });
  }, [opacity, duration, changeWord]);

  useEffect(() => {
    const timer = setTimeout(() => {
      animateBackgroundColor();
      animate();
    }, duration);
    return () => clearTimeout(timer);
  }, [animate, animateBackgroundColor, duration, currentWord]);

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
