import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import COLORS from '../values/COLORS';

export default function ScrollMessage({
  returnTap,
  message = 'NO MESSAGE PASSED',
}) {
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
    backgroundColor: COLORS.alt2Bg,
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
