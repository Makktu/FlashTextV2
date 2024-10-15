import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import COLORS from '../values/COLORS';

import MyButton from '../components/MyButton';

export default function FlashMessage({ returnTap, message, duration }) {
  const [orientation, setOrientation] = useState('PORTRAIT'); // the default

  const width = useSharedValue(100);
  const fontSize = useSharedValue(58);

  const handlePress = () => {
    width.value = withSpring(width.value + 1000);
    fontSize.value = withSpring(fontSize.value + 100);
  };

  useEffect(() => {
    // Function to get the current orientation and set it
    const getOrientation = async () => {
      const orientationLock = await ScreenOrientation.getOrientationAsync();
      handleOrientationChange(orientationLock);
    };

    // Call function to set initial orientation
    getOrientation();

    // Set up listener for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (evt) => {
        const newOrientation = evt.orientationInfo.orientation;
        handleOrientationChange(newOrientation);
      }
    );

    // Cleanup listener on unmount
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);
  // Function to update orientation state and apply UI changes
  const handleOrientationChange = (orientationValue) => {
    switch (orientationValue) {
      case ScreenOrientation.Orientation.PORTRAIT_UP:
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        setOrientation('PORTRAIT');
        break;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        setOrientation('LANDSCAPE');
        break;
      default:
        setOrientation('UNKNOWN');
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.messageContainer}>
        <Animated.Text
          style={{
            width,
            height: 100,
            backgroundColor: '#ffc0cb1e',
            marginTop: 200,
            fontSize: fontSize,
          }}
        >
          <Text style={styles.messageText}>{message[0]}</Text>
        </Animated.Text>
      </View>
      <MyButton whenPressed={handlePress}>CLICK</MyButton>
      <MyButton whenPressed={returnTap}>CLICK</MyButton>
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
    marginTop: 200,
  },
});
