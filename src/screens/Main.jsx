import { StatusBar, StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import MyButton from '../components/MyButton';
import Options from './Options';

const Main = () => {
  const [text, setText] = useState('');
  const [history, changeHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const historyManagement = () => {
    if (text == history[history.length - 1]) {
      console.log('duplicate');
    } else {
      if (history.length >= 100) {
        history.shift();
      }
      history.push(text);
      changeHistory(history);
      console.log(history);
    }
  };

  const handleInput = (enteredText) => {
    setText(enteredText);
  };

  const clearInput = () => {
    setText('');
  };

  const startPressed = () => {
    if (!text) {
      return;
    }
    // auto-add current entry to User History
    // (depending on options)
    historyManagement();
    // then handle display
  };

  const optionsPressed = () => {
    console.log('options pressed');
  };

  const historyPressed = () => {
    console.log('history pressed');
  };

  return (
    <>
      <StatusBar style='light' />
      {/* <View style={styles.bar}></View> */}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.text}>FlashText</Text>
          <Text style={styles.textTwo}>2.0</Text>
        </View>
        <View style={styles.inputContainer}>
          <InputBox text={text} handleInput={handleInput} />
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.startAndClearButtons}>
            <MyButton
              style={styles.button}
              icon='play-box'
              size={28}
              whenPressed={startPressed}
            >
              START!
            </MyButton>
            <MyButton
              style={styles.button}
              icon='play-box'
              size={28}
              whenPressed={clearInput}
            >
              CLEAR
            </MyButton>
          </View>
          <MyButton
            style={styles.button}
            icon='play-box'
            size={28}
            whenPressed={historyPressed}
          >
            HISTORY
          </MyButton>
          <MyButton
            style={styles.button}
            icon='adjust'
            size={28}
            whenPressed={optionsPressed}
          >
            OPTIONS
          </MyButton>
        </View>
      </View>
      {/* <View style={styles.bar}></View> */}
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
    paddingLeft: 20,
  },
  text: {
    fontSize: 74,
    color: 'orangered',
  },
  textTwo: {
    fontSize: 18,
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
    backgroundColor: '#ff0000ff',
  },
  button: {
    marginVertical: 18,
    backgroundColor: 'red',
  },
});
