import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

export default function ScrollMessage() {
  return (
    <TouchableOpacity style={styles.container} onPress={returnTap}>
      <Text>ScrollMessage</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
