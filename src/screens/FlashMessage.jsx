import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useState, useEffect } from 'react';
import COLORS from '../values/COLORS';

export default function FlashMessage({
  type,
  returnTap,
  message = 'NO MESSAGE PASSED',
}) {
  const [orientation, setOrientation] = useState('PORTRAIT'); // the default
  useEffect(() => {
    // Function to get the current orientation and set it
    const getOrientation = async () => {
      const orientationLock = await ScreenOrientation.getOrientationAsync();
      console.log(orientationLock);
      handleOrientationChange(orientationLock);
    };

    // Call function to set initial orientation
    getOrientation();

    // Set up listener for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (evt) => {
        const newOrientation = evt.orientationInfo.orientation;
        console.log(newOrientation);
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

        console.log('getting here');
    }
    console.log('and here');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={returnTap}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
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
    fontSize: 58,
    color: 'white',
  },
});
