import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import COLORS from '../values/COLORS';

export default function MyButton({
  size,
  children = 'Needs Content!',
  whenPressed,
}) {
  return (
    <Button
      style={styles.button}
      mode='contained'
      onPress={whenPressed}
      buttonColor={COLORS.primary} // Matching primary color from new theme
      textColor={COLORS.white} // Matching text color
      contentStyle={{ height: 70 }} // Ensuring consistent button height
      labelStyle={{
        fontSize: size,
        fontWeight: 'bold',
      }}
    >
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderRadius: 16, // Softer edges for a modern look
    shadowColor: COLORS.shadow, // Adding shadow for depth
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // Elevation for Android
  },
});
