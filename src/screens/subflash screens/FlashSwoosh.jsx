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

// Function to get a contrasting color for readability
const getContrastingColor = (bgColor) => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186 ? '#000000' : '#FFFFFF';
};

// Function to get random color different from the last one
const getRandomColor = (previousColor) => {
  let newColor;
  do {
    newColor =
      availableColors[Math.floor(Math.random() * availableColors.length)];
  } while (newColor === previousColor);
  return newColor;
};

// Function to get random direction different from the last one
const getRandomDirection = (previousDirection) => {
  const directions = ['left-right', 'right-left', 'top-bottom', 'bottom-top'];
  let newDirection;
  do {
    newDirection = directions[Math.floor(Math.random() * directions.length)];
  } while (newDirection === previousDirection);
  return newDirection;
};

export default function FlashSwoosh({
  message = ['No', 'Message', 'Passed'],
  duration = 2000,
  randomizeBgColor = false,
  userBgColor = '#000000',
  userFont = 'Roboto',
  swooshDirection = 'left',
}) {
  const [currentWord, setCurrentWord] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
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

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ],
  }));

  const animatedBgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  const changeWord = () => {
    setCurrentWord((prev) => (prev + 1) % message.length);
  };

  const animateSwoosh = (prevDirection) => {
    if (!isComponentMounted.value) return prevDirection;

    const direction =
      swooshDirection === 'random'
        ? getRandomDirection(prevDirection)
        : swooshDirection;

    let start, middle, end;
    const screenData = getFlashScreenDimensions();
    
    // Reset both translations at the start
    translateX.value = 0;
    translateY.value = 0;

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
      default:
        start = { x: 0, y: screenData.height };
        middle = { x: 0, y: 0 };
        end = { x: 0, y: -screenData.height };
        break;
    }

    if (isComponentMounted.value) {
      // Set initial position and make visible
      translateX.value = start.x;
      translateY.value = start.y;
      opacity.value = 0;

      // Animate in
      translateX.value = withTiming(middle.x, { duration: duration * 0.3 });
      translateY.value = withTiming(middle.y, { duration: duration * 0.3 });
      opacity.value = withTiming(1, { duration: duration * 0.3 });

      // Hold in middle
      setTimeout(() => {
        if (isComponentMounted.value) {
          // Animate out
          translateX.value = withTiming(end.x, { duration: duration * 0.3 });
          translateY.value = withTiming(end.y, { duration: duration * 0.3 });
          opacity.value = withTiming(0, { duration: duration * 0.3 });
        }
      }, duration * 0.4);
    }

    return direction;
  };

  const animateBackgroundColor = (previousColor) => {
    if (!isComponentMounted.value) return previousColor;

    if (randomizeBgColor) {
      const newColor = getRandomColor(previousColor);
      bgColor.value = withTiming(newColor, { duration: duration / 4 });
      textColor.value = withTiming(getContrastingColor(newColor), {
        duration: duration / 4,
      });
      return newColor;
    }
    return previousColor;
  };

  useEffect(() => {
    let lastDirection = swooshDirection;
    let lastColor = userBgColor;
    let intervalId;

    if (isComponentMounted.value) {
      intervalId = setInterval(() => {
        if (isComponentMounted.value) {
          lastColor = animateBackgroundColor(lastColor);
          lastDirection = animateSwoosh(lastDirection);
          changeWord();
        }
      }, duration);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    animateBackgroundColor,
    animateSwoosh,
    changeWord,
    duration,
    swooshDirection,
    userBgColor,
    isComponentMounted
  ]);

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
  },
  messageText: {
    fontWeight: 'bold',
  },
});
