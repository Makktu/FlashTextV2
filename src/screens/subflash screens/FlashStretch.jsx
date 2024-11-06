import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { fontScalingFactors } from '../../values/fontScalingFactors';

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
  const [fontSize, setFontSize] = useState(
    fontScalingFactors[userFont] || fontScalingFactors.default
  );
  const scale = useSharedValue(0.1);
  const opacity = useSharedValue(0);
  const bgColor = useSharedValue(
    randomizeBgColor ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));

  const calculateInitialFontSize = useCallback((text) => {
    const screenData = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
    // Set initial font size to be readable but small enough to show dramatic scaling
    const minScreenDimension = Math.min(screenData.width, screenData.height);
    return minScreenDimension * 0.15; // Reduced from 0.8 to make initial size smaller
  }, []);

  console.log(userFont);

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
    // Calculate a much larger scale factor to ensure text expands beyond screen
    const screenData = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };
    const maxScreenDimension = Math.max(screenData.width, screenData.height);
    // Scale up to 3x the screen size for dramatic effect
    return (maxScreenDimension * 0.3) / fontSize;
  }, [fontSize]);

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

    // Start with fade in
    opacity.value = withTiming(1, { duration: duration / 4 });

    // Expand beyond screen boundaries
    scale.value = withTiming(
      calculateScale(),
      {
        duration: (duration * 3) / 4,
      },
      (finished) => {
        if (finished) {
          // Start fade out when maximum scale is reached
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

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
      <Animated.Text
        style={[
          styles.messageText,
          { fontSize, fontFamily: userFont },
          animatedStyle,
          animatedTextStyle,
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
    overflow: 'hidden', // Remove this to allow content to expand beyond boundaries
  },
  messageText: {
    fontWeight: 'bold',
  },
});
