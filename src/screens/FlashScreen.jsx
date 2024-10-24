import { StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import COLORS from '../values/COLORS';
// import FlashMessage from '../components/FlashMessage';
import FlashStretch from './subflash screens/FlashStretch';
import FlashPlain from './subflash screens/FlashPlain';
import FlashSwoosh from './subflash screens/FlashSwoosh';

export default function FlashScreen({
  returnTap,
  message = ['no', 'message', 'was', 'passed'],
  userBgColor,
  displayHeight,
  displayWidth,
  duration = 2000,
  flashType,
  swooshDirection,
  randomizeBgColor,
}) {
  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={returnTap}>
      {flashType === 'stretch' && (
        <FlashStretch
          message={message}
          duration={duration}
          userBgColor={userBgColor}
          randomizeBgColor={randomizeBgColor}
        />
      )}
      {flashType === 'plain' && (
        <FlashPlain
          message={message}
          duration={duration}
          randomizeBgColor={randomizeBgColor}
          userBgColor={userBgColor}
        />
      )}
      {flashType === 'swoosh' && (
        <FlashSwoosh
          message={message}
          duration={duration + 500}
          randomizeBgColor={randomizeBgColor}
          userBgColor={userBgColor}
          swooshDirection={swooshDirection}
          fontSizeFactor={0.3}
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
