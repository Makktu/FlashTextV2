import { StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native';

import React, { useEffect } from 'react';
import COLORS from '../values/COLORS';
import FlashMessage from '../components/FlashMessage';

export default function FlashScreen({
  returnTap,
  message,
  displayHeight,
  displayWidth,
  duration,
}) {
  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={returnTap}>
      <FlashMessage
        message={message}
        displayHeight={displayHeight}
        displayWidth={displayWidth}
        duration={2000}
        animationType={'swoosh'}
        randomizeDirection={true}
        stretch={false}
        swoosh={true}
        stretchSwoosh={false}
        randomColors={false}
      />
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
