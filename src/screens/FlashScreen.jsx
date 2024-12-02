import { StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import COLORS from '../values/COLORS';
import FlashStretch from './subflash screens/FlashStretch';
import FlashPlain from './subflash screens/FlashPlain';
import FlashSwoosh from './subflash screens/FlashSwoosh';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Platform } from 'react-native';

export default function FlashScreen({
  returnTap,
  message = ['no', 'message', 'was', 'passed'],
  userBgColor,
  duration = 2000,
  flashType,
  swooshDirection,
  randomizeBgColor,
  userFont,
  fontSizeAdjustment = 0,
}) {
  const [isOrientationSet, setIsOrientationSet] = useState(false);

  console.log(userFont);

  // Force orientation change before rendering content
  useEffect(() => {
    async function setOrientation() {
      if (Platform.isPad) {
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
          );
          // Small delay to ensure orientation change is complete
          await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (error) {
          console.error('Failed to lock orientation:', error);
        }
      } else {
        await ScreenOrientation.unlockAsync();
      }
      setIsOrientationSet(true);
    }

    setOrientation();
    StatusBar.setHidden(true);

    return () => {
      if (Platform.isPad) {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        ).catch(console.error);
      }
    };
  }, []);

  // Don't render content until orientation is set
  if (!isOrientationSet && Platform.isPad) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={returnTap}>
      {flashType === 'stretch' && (
        <FlashStretch
          message={message}
          duration={duration}
          userBgColor={userBgColor}
          randomizeBgColor={randomizeBgColor}
          userFont={userFont}
        />
      )}
      {flashType === 'plain' && (
        <FlashPlain
          message={message}
          duration={duration}
          randomizeBgColor={randomizeBgColor}
          userBgColor={userBgColor}
          userFont={userFont}
        />
      )}
      {flashType === 'swoosh' && (
        <FlashSwoosh
          message={message}
          duration={duration}
          randomizeBgColor={randomizeBgColor}
          userBgColor={userBgColor}
          swooshDirection={swooshDirection}
          userFont={userFont}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.alt1Bg,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    color: '#fd05ec',
  },
});
