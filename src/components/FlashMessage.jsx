import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

export default function FlashMessage({
  message,
  duration,
  displayHeight,
  displayWidth,
}) {
  const [nextWord, setNextWord] = useState(0);

  const width = useSharedValue(displayWidth);
  let fontSize = useSharedValue(50);
  console.log(message);

  const handlePress = () => {
    width.value = withSpring(width.value + 500);
    fontSize.value = withSpring(fontSize.value + 100);
  };

  const startAnimation = () => {
    width.value = withSpring(width.value + 500);
    fontSize.value = withSpring(fontSize.value + 100);
    setTimeout(animationFinished, 500);
  };

  const animationFinished = () => {
    if (nextWord == message.length - 1) {
      fontSize = 50;
      setNextWord(0);
    } else {
      setNextWord(nextWord + 1);
    }
  };

  useEffect(() => {
    startAnimation(); // Start the animation when the component mounts
  }, [nextWord]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={{
          width,
          // height: displayHeight,
          // marginTop: 200,
          fontSize: fontSize,
        }}
      >
        <Text adjustsFontSizeToFit={true} style={styles.messageText}>
          {message[nextWord]}
        </Text>
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'red',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: 'white',
    textAlign: 'center',
  },
});
