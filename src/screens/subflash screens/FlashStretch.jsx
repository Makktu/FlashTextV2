import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { fontScalingFactors } from '../../values/fontScalingFactors';
import availableColors from '../../values/COLORS';
import { getFlashScreenDimensions } from '../../utils/screenDimensions';

const getContrastingColor = (bgColor) => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186 ? '#000000' : '#FFFFFF';
};

export default function FlashStretch({
  message,
  duration = 2000,
  randomizeBgColor = false,
  userBgColor = '#000000',
  userFont,
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const [fontSize, setFontSize] = useState(30);
  const [textDimensions, setTextDimensions] = useState({ width: 1, height: 1 });
  const scale = useSharedValue(0.1);
  const opacity = useSharedValue(0);
  const bgColor = useSharedValue(
    randomizeBgColor ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));
  const isComponentMounted = useSharedValue(true);
  const textRef = useRef(null);

  const calculateFontSize = useCallback(
    (text) => {
      const screenData = getFlashScreenDimensions();
      const minScreenDimension = Math.min(screenData.width, screenData.height);
      const availableWidth = screenData.width * 0.9;
      const MIN_FONT_SIZE = 12;

      const fontScale =
        fontScalingFactors[userFont] || fontScalingFactors.default;

      const fontSize = Math.min(
        Math.max(MIN_FONT_SIZE, (availableWidth / text.length) * fontScale),
        minScreenDimension * 0.15
      );

      return fontSize;
    },
    [userFont]
  );

  useEffect(() => {
    const updateFontSize = () => {
      const newSize = calculateFontSize(message[currentWord]);
      setFontSize(newSize);
    };

    updateFontSize();

    const subscription = Dimensions.addEventListener('change', updateFontSize);

    return () => {
      subscription.remove();
    };
  }, [currentWord, message, calculateFontSize]);

  useEffect(() => {
    isComponentMounted.value = true;
    return () => {
      isComponentMounted.value = false;
      scale.value = 0.1;
      opacity.value = 0;
      bgColor.value = userBgColor;
      textColor.value = getContrastingColor(userBgColor);
      setCurrentWord(0);
    };
  }, []);

  const calculateScale = useCallback(() => {
    if (!textDimensions.width || !textDimensions.height) {
      return 1;
    }

    const screenData = getFlashScreenDimensions();
    const availableWidth = screenData.width * 0.9;
    const availableHeight = screenData.height * 0.9;

    const maxScaleWidth = textDimensions.width > 0 ? availableWidth / textDimensions.width : 1;
    const maxScaleHeight = textDimensions.height > 0 ? availableHeight / textDimensions.height : 1;

    const calculatedScale = Math.min(maxScaleWidth, maxScaleHeight);
    
    const MAX_SCALE = 10;
    
    return Math.min(
      Math.max(
        isFinite(calculatedScale) ? calculatedScale : 1,
        0.1
      ),
      MAX_SCALE
    );
  }, [textDimensions]);

  const animatedStyle = useAnimatedStyle(() => {
    const safeScale = isFinite(scale.value) && scale.value > 0 ? scale.value : 1;
    return {
      transform: [{ scale: safeScale }],
      opacity: opacity.value,
    };
  });

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
    if (!isComponentMounted.value) return;

    const targetScale = calculateScale();
    if (!isFinite(targetScale) || targetScale <= 0) return;

    scale.value = 0.1;
    opacity.value = 0;

    opacity.value = withTiming(1, { duration: duration / 4 });

    scale.value = withTiming(
      targetScale,
      {
        duration: (duration * 3) / 4,
      },
      (finished) => {
        if (finished && isComponentMounted.value) {
          opacity.value = withTiming(
            0,
            { duration: duration / 4 },
            (finished) => {
              if (finished && isComponentMounted.value) {
                runOnJS(changeWord)();
              }
            }
          );
        }
      }
    );
  }, [calculateScale, scale, opacity, duration, changeWord, isComponentMounted]);

  const handleTextLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setTextDimensions({ 
      width: Math.max(width, 1),
      height: Math.max(height, 1)
    });
  }, []);

  useEffect(() => {
    animateBackgroundColor();
    animateStretch();
  }, [animateBackgroundColor, animateStretch, currentWord]);

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
