import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';

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
      buttonColor='orangered'
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
          color: 'black',
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
  },
});
