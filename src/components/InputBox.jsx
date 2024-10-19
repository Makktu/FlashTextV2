import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import React from 'react';

export default function InputBox({ handleInput, text }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.inputText, { width: '100%' }]}
        textColor='white'
        mode='outlined'
        placeholder='Enter Your Message!'
        selectionColor='#FFFFFF'
        placeholderTextColor='#8e9498'
        onChangeText={handleInput}
        value={text}
        underlineColor='transparent'
        outlineColor='#37474F'
        activeOutlineColor='#546E7A'
        theme={{ colors: { text: '#FFFFFF', background: '#263238' } }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  inputText: {
    height: 60,
    backgroundColor: '#263238', // Dark background matching the theme
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
