import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Modal, Portal, PaperProvider } from 'react-native-paper';
import InputBox from '../components/InputBox';
import MyButton from '../components/MyButton';
import FlashMessage from './FlashMessage';
import Options from './Options';
import COLORS from '../values/COLORS';
import ScrollMessage from './ScrollMessage';

const Main = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [text, setText] = useState('');
  const [choppedMessage, setChoppedMessage] = useState([]);
  const [history, changeHistory] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('main');
  const [currentMode, setCurrentMode] = useState('flash');
  const [showHistory, setShowHistory] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  console.log(windowHeight, windowWidth);

  // useEffect(() => {
  //   StatusBar.setHidden(false);
  // }, []);

  const showModal = () => {
    setSettingsVisible(true);
  };
  const hideModal = () => {
    setSettingsVisible(false);
  };

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
    setChoppedMessage(text.split(' '));
    setCurrentScreen(currentMode == 'flash' ? 'flash' : 'scroll');
  };

  const settingsPressed = () => {
    // showModal(); - DISABLED FOR NOW
    console.log('settings pressed');
  };

  const historyPressed = () => {
    console.log(history);
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
      <PaperProvider>
        <>
          <Portal>
            <Modal
              visible={settingsVisible}
              onDismiss={hideModal}
              contentContainerStyle={styles.modalContainerStyle}
            >
              <Options />
            </Modal>
          </Portal>
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
                {currentMode == 'flash' ? 'FLASH' : 'SCROLL'}
              </MyButton>
              <MyButton
                style={styles.button}
                icon='play-box'
                size={28}
                whenPressed={settingsPressed}
              >
                SETTINGS
              </MyButton>
            </View>
          </View>
          {/* <View style={styles.bar}></View> */}
        </>
      </PaperProvider>
    )) ||
    (currentScreen == 'flash' && (
      <FlashMessage
        returnTap={returnTap}
        message={choppedMessage}
        displayHeight={windowHeight}
        displayWidth={windowWidth}
      />
    )) ||
    (currentScreen == 'scroll' && (
      <ScrollMessage returnTap={returnTap} message={text} />
    ))
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.alt2Bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  modalContainerStyle: {
    flex: 1,
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
