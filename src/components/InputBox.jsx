import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library

export default function InputBox({ handleInput, cancelInput, text }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          autoFocus={true}
          style={styles.inputText}
          textColor='white'
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
        {/* Conditionally render the cancel icon based on the text input */}
        {text.length > 0 && (
          <Icon
            name='close-circle' // Use the appropriate icon name
            size={30} // Adjust size as needed
            color='#FFFFFF' // Set the icon color
            style={styles.cancelIcon}
            onPress={cancelInput} // Call cancelInput on press
          />
        )}
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
    position: 'relative',
    width: '100%',
  },
  inputText: {
    height: 60,
    backgroundColor: '#cc13cf6c', // Dark background matching the theme
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 12, // Optional: Add border radius for a smoother look
    paddingRight: 50, // Add padding to the right to make space for the cancel button
  },
  cancelIcon: {
    position: 'absolute',
    right: 15, // Position the icon inside the TextInput
    top: 15, // Center vertically
  },
});
