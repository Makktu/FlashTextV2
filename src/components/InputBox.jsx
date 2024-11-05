import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import React from 'react';

export default function InputBox({ handleInput, cancelInput, text }) {
  return (
    <View style={styles.container}>
      <TextInput
        autoFocus={true}
        style={[styles.inputText, { width: '100%' }]}
        textColor='white'
        // mode='outlined'
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
      {/* <Button style={styles.cancelInput} onPress={cancelInput}>
        <Text style={styles.cancelInputText}>X</Text>
      </Button> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
  },
  inputText: {
    height: 60,
    backgroundColor: '#830ec7', // Dark background matching the theme
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    // borderRadius: 60,
  },
  cancelInput: {
    height: 70, // Increase height to accommodate bigger text
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0, // Remove space between TextInput and Button
  },
  cancelInputText: {
    color: '#FFFFFF',
    fontSize: 50, // Decrease font size to maintain aspect ratio
    fontWeight: 'bold',
  },
});
