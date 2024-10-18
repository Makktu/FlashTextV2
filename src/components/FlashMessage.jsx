import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

// Function to get the current screen dimensions and orientation
const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width; // Detect orientation
  return { width, height, isPortrait };
};

export default function FlashMessage({
  message,
  duration = 1000, // Animation duration
  animationType = 'stretch', // Default to 'stretch' animation
}) {
  const [nextWord, setNextWord] = useState(0); // Index of the current word
  const [screenData, setScreenData] = useState(getScreenDimensions()); // Screen size and orientation

  const scale = useSharedValue(0); // For 'stretch' animation (start with text invisible)
  const translateX = useSharedValue(screenData.width); // For 'swoosh' animation (start off-screen to the right)

  // Function to calculate dynamic scale based on word length and screen size
  const calculateScale = (word) => {
    const wordLength = word.length;
    const baseFontSize = 30; // Starting font size for words
    const maxWidth = screenData.isPortrait
      ? screenData.width
      : screenData.width * 0.9;
    const maxHeight = screenData.isPortrait
      ? screenData.height * 0.9
      : screenData.height * 0.8;
    const desiredFontSizeByWidth = (maxWidth * 0.8) / wordLength;
    const desiredFontSizeByHeight = maxHeight / 2;
    const desiredFontSize = Math.min(
      desiredFontSizeByWidth,
      desiredFontSizeByHeight
    );
    const scaleValue = desiredFontSize / baseFontSize; // Calculate the scale factor
    return scaleValue;
  };

  // Animated style for the 'stretch' animation
  const stretchStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Animated style for the 'swoosh' animation
  const swooshStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { scale: scale.value }], // Combine translation and scaling
    };
  });

  // Function to animate the text based on the selected animation type
  const animateText = () => {
    if (animationType === 'stretch') {
      const currentWord = message[nextWord];
      const dynamicScale = calculateScale(currentWord); // Get dynamic scale based on word length

      // Animate scale from 0 to dynamic scale
      scale.value = withTiming(dynamicScale, { duration: 500 }, () => {
        scale.value = withTiming(1, { duration: 500 }, () => {
          runOnJS(animationFinished)();
        });
      });
    } else if (animationType === 'swoosh') {
      const currentWord = message[nextWord];
      const dynamicScale = calculateScale(currentWord); // Get dynamic scale based on word length

      // Animate the word swooshing in from the right
      translateX.value = screenData.width; // Start off-screen on the right
      scale.value = dynamicScale; // Scale the word based on length and screen size

      translateX.value = withSequence(
        withTiming(0, { duration: 500 }), // Swoosh to the center
        withTiming(0, { duration: 750 }), // Pause in the center
        withTiming(-screenData.width, { duration: 500 }, () => {
          // Exit off-screen to the left
          runOnJS(animationFinished)(); // After exiting, show the next word
        })
      );
    }
  };

  // Function to update the next word when animation finishes
  const animationFinished = () => {
    if (nextWord === message.length - 1) {
      setNextWord(0); // Loop back to the first word
    } else {
      setNextWord(nextWord + 1); // Move to the next word
    }
  };

  // useEffect to run the animation whenever the word changes
  useEffect(() => {
    scale.value = 0; // Reset scale for 'stretch' animation
    translateX.value = screenData.width; // Reset position for 'swoosh' animation (off-screen to the right)
    animateText(); // Start the animation based on the animation type
  }, [nextWord, screenData, animationType]);

  // Listener to update screen dimensions and orientation on resize
  useEffect(() => {
    const updateScreenData = () => {
      setScreenData(getScreenDimensions());
    };

    const subscription = Dimensions.addEventListener(
      'change',
      updateScreenData
    );

    return () => {
      subscription.remove(); // Clean up the event listener
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.messageText,
          animationType === 'stretch' ? stretchStyle : swooshStyle,
        ]}
      >
        {message[nextWord]} {/* Display the current word */}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'black', // Optional: improves visibility for white text
  },
  messageText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 30, // Base font size used for dynamic scaling
    fontWeight: 'bold',
  },
});
