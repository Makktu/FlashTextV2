import { StyleSheet, View, Text } from 'react-native';
import { Searchbar } from 'react-native-paper';
import React from 'react';

export default function InputBox({ handleInput, cancelInput, text }) {
  return (
    <View>
      <View style={styles.inputContainer}>
        <Searchbar
          // autoFocus={true}
          style={styles.inputText}
          inputStyle={{ fontSize: 26, textAlign: 'left' }}
          textColor='white'
          placeholder='Enter Your Message'
          selectionColor='#971cde'
          placeholderTextColor='#1414144a'
          onChangeText={handleInput}
          value={text}
          underlineColor='transparent'
          outlineColor='#37474F'
          activeOutlineColor='#546E7A'
          clearButtonMode="while-editing"
          clearIcon={() => (
            <View style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </View>
          )}
          onClearIconPress={() => handleInput('')}
        />
      </View>
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
  inputContainer: {
    height: 88,
    width: '100%',
    textAlign: 'center',
    marginVertical: 4,
  },
  inputText: {
    height: 60,
    fontSize: 64,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelIcon: {
    position: 'absolute',
    right: 15, // Position the icon inside the TextInput
    top: 15, // Center vertically
  },
  clearButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
});
