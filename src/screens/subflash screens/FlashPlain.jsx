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
import { calculateFontSize, getFlashScreenDimensions } from '../../utils/textUtils';

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
  const opacity = useSharedValue(1);
  const [fontSize, setFontSize] = useState(30);
  const bgColor = useSharedValue(
    randomizeBgColor ? availableColors[0] : userBgColor
  );
  const textColor = useSharedValue(getContrastingColor(bgColor.value));
  const isComponentMounted = useSharedValue(true);
  const [isCalculatingSize, setIsCalculatingSize] = useState(false);

  // Font size calculation and orientation handling
  useEffect(() => {
    let isMounted = true;
    
    const updateFontSize = () => {
      if (!isMounted || isCalculatingSize) return;
      
      setIsCalculatingSize(true);
      try {
        const newSize = calculateFontSize(
          message[currentWord],
          userFont,
          fontScalingFactors
        );
        if (isMounted) {
          setFontSize(newSize);
        }
      } catch (error) {
        console.error('Error calculating font size:', error);
      } finally {
        setIsCalculatingSize(false);
      }
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        if (isMounted) {
          updateFontSize();
        }
      }, 50);
    };

    updateFontSize();
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    
    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [currentWord, message, userFont, isCalculatingSize]);

  // Reset all animations and states when unmounting
  useEffect(() => {
    isComponentMounted.value = true;
    return () => {
      isComponentMounted.value = false;
      opacity.value = 1;
      bgColor.value = userBgColor;
      textColor.value = getContrastingColor(userBgColor);
      setCurrentWord(0);
    };
  }, []);

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
    if (!isComponentMounted.value) return;

    if (randomizeBgColor) {
      const newColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      bgColor.value = withTiming(newColor, { duration: duration / 4 });
      textColor.value = withTiming(getContrastingColor(newColor), {
        duration: duration / 4,
      });
    }
  }, [randomizeBgColor, bgColor, textColor, duration, isComponentMounted]);

  const animate = useCallback(() => {
    if (!isComponentMounted.value) return;

    opacity.value = withTiming(0, { duration: duration / 4 }, (finished) => {
      if (finished && isComponentMounted.value) {
        runOnJS(changeWord)();
        opacity.value = withTiming(1, { duration: duration / 4 });
      }
    });
  }, [opacity, duration, changeWord, isComponentMounted]);

  useEffect(() => {
    let timerId;

    if (isComponentMounted.value) {
      timerId = setTimeout(() => {
        if (isComponentMounted.value) {
          animateBackgroundColor();
          animate();
        }
      }, duration);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [
    animate,
    animateBackgroundColor,
    duration,
    currentWord,
    isComponentMounted,
  ]);

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
      <Animated.Text
        style={[
          styles.messageText,
          { 
            fontSize,
            fontFamily: userFont,
            maxWidth: '90%',  // Ensure text stays within bounds
            textAlign: 'center'
          },
          animatedStyle,
          animatedTextStyle,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit={true}  // Fallback auto-adjustment
        minimumFontScale={0.5}
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
