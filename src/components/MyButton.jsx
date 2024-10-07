import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import COLORS from '../values/COLORS';

export default function MyButton({
  size = 24,
  icon = 'head-question',
  children = 'Needs Content!',
  whenPressed,
}) {
  return (
    <Button
      style={styles.button}
      icon={icon}
      buttonColor={COLORS.alt2Secondary}
      mode='outlined'
      onPress={whenPressed}
      textColor='white'
      labelStyle={{
        paddingVertical: 8,
      }}
    >
      <Text
        style={{
          fontSize: size,
          color: '#ffffff',
          fontWeight: 'bold',
          padding: 12,
        }}
      >
        {children}
      </Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 70,
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
});
