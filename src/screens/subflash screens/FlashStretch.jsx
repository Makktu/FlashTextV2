import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { fontScalingFactors } from '../../values/fontScalingFactors';
import availableColors from '../../values/COLORS';
import { calculateFontSize, getFlashScreenDimensions } from '../../utils/textUtils';

const getContrastingColor = (bgColor) => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186 ? '#000000' : '#FFFFFF';
};

export default function FlashStretch({
  message = ['No', 'Message', 'Passed'],
  duration = 2000,
  randomizeBgColor = false,
  userBgColor = '#000000',
  userFont = 'Roboto',
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const scale = useSharedValue(0.1);  // Start small
  const opacity = useSharedValue(0);   // Start invisible
  const [fontSize, setFontSize] = useState(30);
  const bgColor = useSharedValue(randomizeBgColor ? availableColors[0] : userBgColor);
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

  useEffect(() => {
    // Initial animation
    if (isComponentMounted.value) {
      animateStretch();
    }
  }, []);  // Run once on mount

  useEffect(() => {
    isComponentMounted.value = true;
    return () => {
      isComponentMounted.value = false;
      scale.value = 0.1;  // Reset to initial values
      opacity.value = 0;
      bgColor.value = userBgColor;
      textColor.value = getContrastingColor(userBgColor);
      setCurrentWord(0);
    };
  }, []);

  const calculateScale = useCallback(() => {
    const screenData = getFlashScreenDimensions();
    const baseScale = screenData.isLandscape ? 1.2 : 1.4;
    return baseScale;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
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
    if (!isComponentMounted.value) return;

    const targetScale = calculateScale();
    
    // Reset to starting position
    scale.value = 0.1;
    opacity.value = 0;

    // Change background color if randomization is enabled
    animateBackgroundColor();

    // Fade in and grow
    scale.value = withTiming(targetScale, { 
      duration: duration * 0.75,
      easing: Easing.out(Easing.ease)
    });
    opacity.value = withTiming(1, { 
      duration: duration * 0.25,
      easing: Easing.in(Easing.ease)
    });

    // Fade out
    setTimeout(() => {
      if (isComponentMounted.value) {
        opacity.value = withTiming(
          0,
          { 
            duration: duration * 0.25,
            easing: Easing.in(Easing.ease)
          },
          (finished) => {
            if (finished && isComponentMounted.value) {
              runOnJS(changeWord)();
              runOnJS(animateStretch)();
            }
          }
        );
      }
    }, duration * 0.75);
  }, [scale, opacity, duration, changeWord, isComponentMounted, calculateScale, animateBackgroundColor]);

  useEffect(() => {
    animateBackgroundColor();
  }, [animateBackgroundColor]);

  return (
    <Animated.View style={[styles.container, animatedBgStyle]}>
      <Animated.Text
        style={[
          styles.messageText,
          {
            fontSize,
            fontFamily: userFont,
            maxWidth: '90%',
            textAlign: 'center',
          },
          animatedStyle,
          animatedTextStyle,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit={true}
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
    overflow: 'hidden',
  },
  messageText: {
    fontWeight: 'bold',
  },
});
