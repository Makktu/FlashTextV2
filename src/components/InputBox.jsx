import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import React, { useState, useEffect } from 'react';

export default function InputBox(clearInput) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText('');
    console.log('got here');
  }, [clearInput]);

  const onChangeText = (enteredText) => {
    setText(enteredText);
    console.log(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputText}
        mode='outlined'
        textColor='white'
        placeholder='Enter Message'
        selectionColor='white'
        dense={false}
        onChangeText={onChangeText}
        keyboardAppearance='default'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 4,
  },
  inputText: {
    paddingVertical: 0,
    marginVertical: 12,
    height: 60,
    width: '100%',
    backgroundColor: '#f43f0339',
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
  },
});
