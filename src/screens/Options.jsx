import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import COLORS from '../values/COLORS';

export default function Options() {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>Options</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.alt2Secondary,
  },
  title: {},
  text: {
    fontSize: 44,
    color: 'white',
  },
});
