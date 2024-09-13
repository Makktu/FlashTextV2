import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState } from 'react';

export default function InputBox() {
  const [text, setText] = useState('');

  const onChangeText = (enteredText) => {
    setText(enteredText);
    console.log(text);
  };

  return <TextInput style={styles.input} onChangeText={onChangeText} />;
}

const styles = StyleSheet.create({
  inputText: {
    includeFontPadding: false,
    paddingVertical: 12,
    margin: 0,
    width: '100%',
    // backgroundColor: 'rgb(67, 46, 26)',
    backgroundColor: '#472601',
    fontSize: 26,
    lineHeight: 28,
    fontWeight: 'bold',
    textAlign: 'auto',
    justifyContent: 'center',
    alignContent: 'center',
    // textAlignVertical: 'center',
    // height: 80,
  },
});
