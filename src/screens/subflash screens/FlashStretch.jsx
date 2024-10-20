import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

const getContrastingColor = (bgColor) => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186 ? '#000000' : '#FFFFFF';
};

const availableColors = ['#006400', '#00008B', '#8B8000', '#FF4500', '#8B008B'];

export default function FlashStretch({
  message,
  duration = 2000,
  randomBgColors = false,
  userBgColor = '#000000',
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const scale = useSharedValue(0.1);
  const opacity = useSharedValue(0);
  const bgColor = useSharedValue(
    randomBgColors ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));

  const screenData = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  const calculateScale = useCallback(
    (word) => {
      const wordLength = word.length;
      const baseFontSize = 30;
      const maxWidth = screenData.width * 0.9;
      const maxHeight = screenData.height * 0.9;
      const desiredFontSizeByWidth = maxWidth / wordLength;
      const desiredFontSizeByHeight = maxHeight / 2;
      const desiredFontSize = Math.min(
        desiredFontSizeByWidth,
        desiredFontSizeByHeight
      );
      return desiredFontSize / baseFontSize;
    },
    [screenData]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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
    if (randomBgColors) {
      const newColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      bgColor.value = withTiming(newColor, { duration: duration / 4 });
      textColor.value = withTiming(getContrastingColor(newColor), {
        duration: duration / 4,
      });
    }
  }, [randomBgColors, bgColor, textColor, duration]);

  const animateStretch = useCallback(() => {
    scale.value = 0.1;
    opacity.value = 0;

    opacity.value = withTiming(1, { duration: duration / 4 });
    scale.value = withTiming(
      calculateScale(message[currentWord]),
      { duration: (duration * 3) / 4 },
      (finished) => {
        if (finished) {
          opacity.value = withTiming(
            0,
            { duration: duration / 4 },
            (finished) => {
              if (finished) {
                runOnJS(changeWord)();
              }
            }
          );
        }
      }
    );
  }, [
    calculateScale,
    message,
    currentWord,
    scale,
    opacity,
    duration,
    changeWord,
  ]);

  useEffect(() => {
    animateBackgroundColor();
    animateStretch();
  }, [animateBackgroundColor, animateStretch, currentWord]);

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
    fontSize: 30,
    fontWeight: 'bold',
  },
});
