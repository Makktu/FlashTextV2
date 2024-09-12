import { StatusBar, StyleSheet, View, Text } from 'react-native';
import React from 'react';

const Main = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>FlashText 2</Text>
      <Text style={styles.textTwo}>The Flashening</Text>
      <StatusBar style='light' />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 54,
    color: 'orangered',
  },
  textTwo: {
    fontSize: 28,
    color: '#ff4400d0',
  },
});
