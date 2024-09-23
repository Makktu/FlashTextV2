import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import COLORS from '../values/COLORS';

export default function FlashMessage({ returnTap }) {
  return (
    <TouchableOpacity style={styles.container} onPress={returnTap}>
      <Text>FlashMessage</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.alt1Bg,
  },
});
