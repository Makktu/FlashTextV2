import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import COLORS from '../values/COLORS';
import React from 'react';

export default function InputBox({ handleInput, text }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputText}
        mode='outlined'
        textColor='white'
        placeholder='Enter Message'
        selectionColor='white'
        dense={false}
        onChangeText={handleInput}
        keyboardAppearance='default'
        value={text}
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
    backgroundColor: COLORS.alt2Secondary,
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
  },
});
