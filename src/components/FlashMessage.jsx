import { StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  withSequence,
} from 'react-native-reanimated';

const getContrastingColor = (bgColor) => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 2), 16);
  const b = parseInt(color.substring(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Hard-code text color for specific background colors
  if (bgColor === '#FFFF00' || bgColor === '#00FFFF' || bgColor === '#FFC0CB') {
    return '#000000'; // Black for yellow, cyan, and pink
  }

  return brightness > 186 ? '#000000' : '#FFFFFF'; // Default contrasting color
};

export default function FlashMessage({
  message,
  duration = 2000,
  stretch = false,
  swoosh = false,
  stretchSwoosh = false,
  randomColors = false,
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const scale = useSharedValue(1);
  const position = useSharedValue(0);
  const opacity = useSharedValue(1);
  const bgColor = useSharedValue('#000000');
  const textColor = useSharedValue('#FFFFFF');

  const availableColors = [
    '#00FF00',
    '#FFC0CB',
    '#0000FF',
    '#800080',
    '#FFFF00',
    '#FF0000',
    '#00FFFF',
  ];

  const screenData = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  const calculateScale = useCallback(
    (word) => {
      const wordLength = word.length;
      const baseFontSize = 30;
      const maxWidth = screenData.width * 0.8;
      const maxHeight = screenData.height * 0.8;
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
    transform: [{ scale: scale.value }, { translateX: position.value }],
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
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const newColor = availableColors[randomIndex];
    bgColor.value = withTiming(newColor, { duration: 500 });

    // Set text color based on the new background color
    textColor.value = withTiming(getContrastingColor(newColor), {
      duration: 500,
    });
  }, [availableColors, bgColor, textColor]);

  const animateStretch = useCallback(() => {
    scale.value = withSequence(
      withTiming(0, { duration: 250 }),
      withTiming(calculateScale(message[currentWord]), { duration: 750 })
    );
  }, [calculateScale, message, currentWord, scale]);

  const animateSwoosh = useCallback(() => {
    position.value = withSequence(
      withTiming(-screenData.width, { duration: 500 }),
      withTiming(screenData.width, { duration: 0 }),
      withTiming(0, { duration: 500 })
    );
  }, [position, screenData.width]);

  const animateStretchSwoosh = useCallback(() => {
    scale.value = withSequence(
      withTiming(0, { duration: 250 }),
      withTiming(calculateScale(message[currentWord]), { duration: 750 })
    );
    position.value = withSequence(
      withTiming(-screenData.width, { duration: 500 }),
      withTiming(screenData.width, { duration: 0 }),
      withTiming(0, { duration: 500 })
    );
  }, [calculateScale, message, currentWord, scale, position, screenData.width]);

  const animateText = useCallback(() => {
    if (randomColors) {
      animateBackgroundColor();
    } else {
      // Ensure text color contrasts with background even when not using random colors
      textColor.value = withTiming(getContrastingColor(bgColor.value), {
        duration: 500,
      });
    }

    opacity.value = withSequence(
      withTiming(0, { duration: 250 }),
      withTiming(1, { duration: 250 })
    );

    if (stretch) {
      animateStretch();
    } else if (swoosh) {
      animateSwoosh();
    } else if (stretchSwoosh) {
      animateStretchSwoosh();
    }

    setTimeout(changeWord, duration);
  }, [
    randomColors,
    stretch,
    swoosh,
    stretchSwoosh,
    animateBackgroundColor,
    animateStretch,
    animateSwoosh,
    animateStretchSwoosh,
    duration,
    changeWord,
    opacity,
    bgColor,
    textColor,
  ]);

  useEffect(() => {
    animateText();
  }, [animateText, currentWord]);

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
