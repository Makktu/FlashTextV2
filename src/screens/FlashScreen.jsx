import { StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import COLORS from '../values/COLORS';
// import FlashMessage from '../components/FlashMessage';
import FlashStretch from './subflash screens/FlashStretch';
import FlashPlain from './subflash screens/FlashPlain';
import FlashSwoosh from './subflash screens/FlashSwoosh';
import { fontScalingFactors } from '../values/fontScalingFactors';

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
  userFont,
  fontSizeAdjustment = 0,
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
          duration={duration + 500}
          randomizeBgColor={randomizeBgColor}
          userBgColor={userBgColor}
          swooshDirection={swooshDirection}
          fontSizeFactor={0.3}
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
