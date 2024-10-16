import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import COLORS from '../values/COLORS';

export default function FlashMessage({
  returnTap,
  message,
  displayHeight,
  displayWidth,
}) {
  const [nextWord, setNextWord] = useState(0);

  const width = useSharedValue(displayWidth);
  const fontSize = useSharedValue(150);

  const handlePress = () => {
    width.value = withSpring(width.value + 500);
    fontSize.value = withSpring(fontSize.value + 100);
  };

  const startAnimation = () => {
    width.value = withSpring(width.value + 500);
    fontSize.value = withSpring(fontSize.value + 100);
  };

  const onAnimationFinished = () => {
    setNextWord(nextWord + 1);
  };

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  useEffect(() => {
    startAnimation(); // Start the animation when the component mounts
  }, [nextWord]);

  return (
    <TouchableOpacity style={styles.container} onPress={returnTap}>
      <View style={styles.messageContainer}>
        <Animated.Text
          style={{
            width,
            height: displayHeight,
            marginTop: 200,
            fontSize: fontSize,
          }}
        >
          <Text adjustsFontSizeToFit={true} style={styles.messageText}>
            {message[nextWord]}
          </Text>
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.alt1Bg,
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    color: 'white',
  },
});
