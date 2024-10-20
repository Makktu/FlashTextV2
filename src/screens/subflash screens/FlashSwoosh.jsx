import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
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

export default function FlashSwoosh({
  words,
  duration = 2000,
  randomizeBgColor = false,
  userBgColor = '#000000',
  randomDirection = false,
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const position = useSharedValue({ x: 0, y: 0 });
  const opacity = useSharedValue(1);
  const bgColor = useSharedValue(
    randomizeBgColor ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));

  const screenData = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

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
    setCurrentWord((prev) => (prev + 1) % words.length);
  }, [words.length]);

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

  const animateSwoosh = useCallback(() => {
    const directions = randomDirection
      ? ['left-right', 'right-left', 'top-bottom', 'bottom-top']
      : ['left-right'];
    const direction = directions[Math.floor(Math.random() * directions.length)];

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
  }, [position, opacity, screenData, duration, randomDirection]);

  useEffect(() => {
    animateBackgroundColor();
    animateSwoosh();
    const timer = setTimeout(changeWord, duration);
    return () => clearTimeout(timer);
  }, [
    animateBackgroundColor,
    animateSwoosh,
    changeWord,
    duration,
    currentWord,
  ]);

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
      <Animated.Text
        style={[styles.messageText, animatedStyle, animatedTextStyle]}
      >
        {words[currentWord]}
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
