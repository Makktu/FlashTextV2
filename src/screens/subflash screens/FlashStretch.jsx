import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
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

const availableColors = [
  '#04eb04',
  '#0606e7',
  '#f2de07',
  '#FF4500',
  '#f203f2',
  '#000000',
];

export default function FlashStretch({
  message,
  duration = 2000,
  randomizeBgColor = false,
  userBgColor = '#000000',
  userFont,
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const [fontSize, setFontSize] = useState(30);
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 });
  const scale = useSharedValue(0.1);
  const opacity = useSharedValue(0);
  const bgColor = useSharedValue(
    randomizeBgColor ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));
  const textRef = useRef(null);

  const calculateInitialFontSize = useCallback((text) => {
    const screenData = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
    const minScreenDimension = Math.min(screenData.width, screenData.height);
    return minScreenDimension * 0.15;
  }, []);

  useEffect(() => {
    const updateFontSize = () => {
      const newSize = calculateInitialFontSize(message[currentWord]);
      setFontSize(newSize);
    };

    updateFontSize();

    const subscription = Dimensions.addEventListener('change', updateFontSize);

    return () => {
      subscription.remove();
    };
  }, [currentWord, message, calculateInitialFontSize]);

  const calculateScale = useCallback(() => {
    const screenData = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
    const maxScaleWidth = screenData.width / textDimensions.width;
    const maxScaleHeight = screenData.height / textDimensions.height;

    return Math.min(maxScaleWidth, maxScaleHeight);
  }, [textDimensions]);

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
    if (randomizeBgColor) {
      const newColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      bgColor.value = withTiming(newColor, { duration: duration / 4 });
      textColor.value = withTiming(getContrastingColor(newColor), {
        duration: duration / 4,
      });
    }
  }, [randomizeBgColor, bgColor, textColor, duration]);

  const animateStretch = useCallback(() => {
    scale.value = 0.1;
    opacity.value = 0;

    opacity.value = withTiming(1, { duration: duration / 4 });

    scale.value = withTiming(
      calculateScale(),
      {
        duration: (duration * 3) / 4,
      },
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
  }, [calculateScale, scale, opacity, duration, changeWord]);

  useEffect(() => {
    animateBackgroundColor();
    animateStretch();
  }, [animateBackgroundColor, animateStretch, currentWord]);

  const handleTextLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setTextDimensions({ width, height });
  }, []);

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
      <Animated.Text
        ref={textRef}
        style={[
          styles.messageText,
          { fontSize, fontFamily: userFont },
          animatedStyle,
          animatedTextStyle,
        ]}
        onLayout={handleTextLayout}
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
    overflow: 'hidden',
  },
  messageText: {
    fontWeight: 'bold',
  },
});
