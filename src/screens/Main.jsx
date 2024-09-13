import { StatusBar, StyleSheet, View, Text } from 'react-native';
import React from 'react';
import InputBox from '../components/InputBox';

const Main = () => {
  return (
    <>
      <StatusBar style='light' />
      <View style={styles.bar}></View>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.text}>FlashText</Text>
          <Text style={styles.textTwo}>v2.0</Text>
        </View>
        <View style={styles.inputContainer}>
          <InputBox />
        </View>
      </View>
      <View style={styles.bar}></View>
    </>
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
  titleContainer: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 54,
    color: 'orangered',
  },
  textTwo: {
    fontSize: 14,
    color: '#ff4400d0',
  },
  inputContainer: {
    height: 100,
    width: 800,
    // backgroundColor: '#ff00004e',
  },
  bar: {
    height: 100,
    width: 800,
    backgroundColor: 'red',
  },
});
