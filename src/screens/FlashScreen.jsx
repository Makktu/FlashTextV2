import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import COLORS from '../values/COLORS';
import FlashMessage from '../components/FlashMessage';

export default function FlashScreen({
  returnTap,
  message,
  displayHeight,
  displayWidth,
}) {
  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={returnTap}>
      <View style={styles.messageContainer}>
        <FlashMessage
          message={message}
          displayHeight={displayHeight}
          displayWidth={displayWidth}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.alt1Bg,
    borderColor: 'yellow',
    borderWidth: 2,
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    color: 'white',
  },
});
