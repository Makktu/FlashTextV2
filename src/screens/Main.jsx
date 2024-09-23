import { StatusBar, StyleSheet, View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import MyButton from '../components/MyButton';
import FlashMessage from './FlashMessage';
import COLORS from '../values/COLORS';

const Main = () => {
  const [text, setText] = useState('');
  const [history, changeHistory] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('main');
  const [currentMode, setCurrentMode] = useState('flash');
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

  const tellUserToEnter = () => {
    Alert.alert(
      'Enter some Text!',
      'Enter something in the message box and then press Start',
      [{ text: 'OK' }]
    );
  };

  const startPressed = () => {
    if (!text) {
      tellUserToEnter();
      return;
    }
    // auto-add current entry to User History
    // (depending on options)
    historyManagement();
    // then handle display
    setCurrentScreen('flash');
  };

  const optionsPressed = () => {
    console.log('options pressed');
  };

  const historyPressed = () => {
    console.log('history pressed');
  };

  const returnTap = () => {
    console.log('return tap tapped');
    setCurrentScreen('main');
  };

  const modeChanged = () => {
    if (currentMode == 'flash') {
      setCurrentMode('scroll');
    } else {
      setCurrentMode('flash');
    }
  };

  return (
    (currentScreen == 'main' && (
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
              icon='play-box'
              size={28}
              whenPressed={modeChanged}
            >
              FLASH!
            </MyButton>
            <MyButton
              style={styles.button}
              icon='play-box'
              size={28}
              whenPressed={modeChanged}
            >
              SCROLL
            </MyButton>
          </View>
        </View>
        {/* <View style={styles.bar}></View> */}
      </>
    )) || <FlashMessage returnTap={returnTap} />
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.alt1Bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  text: {
    fontSize: 74,
    color: '#fefcfb',
  },
  textTwo: {
    fontSize: 18,
    color: '#ffffff6e',
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
    backgroundColor: '#5f4444',
  },
});
