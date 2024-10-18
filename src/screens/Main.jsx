import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { Modal, Portal, PaperProvider, Button } from 'react-native-paper';
import InputBox from '../components/InputBox';
import MyButton from '../components/MyButton';
import FlashScreen from './FlashScreen';
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

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const showModal = () => setSettingsVisible(true);
  const hideModal = () => setSettingsVisible(false);

  const historyManagement = () => {
    if (text === history[history.length - 1]) {
      console.log('duplicate');
    } else {
      const updatedHistory = [...history];
      if (updatedHistory.length >= 100) {
        updatedHistory.shift();
      }
      updatedHistory.push(text);
      changeHistory(updatedHistory);
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
    historyManagement();
    setChoppedMessage(text.split(' '));
    setCurrentScreen(currentMode === 'flash' ? 'flash' : 'scroll');
  };

  const returnTap = () => setCurrentScreen('main');

  const modeChanged = () =>
    setCurrentMode((prev) => (prev === 'flash' ? 'scroll' : 'flash'));

  return (
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
        {(currentScreen === 'main' && (
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>FlashText</Text>
              <Text style={styles.versionText}>2.0</Text>
            </View>
            <View style={styles.inputContainer}>
              <InputBox text={text} handleInput={handleInput} />
            </View>
            <View style={styles.buttonContainer}>
              <MyButton
                style={styles.startButton}
                icon='play-box'
                size={28}
                whenPressed={startPressed}
              >
                START!
              </MyButton>
              <MyButton
                style={styles.clearButton}
                icon='trash-can'
                size={28}
                whenPressed={clearInput}
              >
                CLEAR
              </MyButton>
              <Button
                style={styles.modeButton}
                mode='contained'
                onPress={modeChanged}
              >
                {currentMode === 'flash' ? 'FLASH' : 'SCROLL'}
              </Button>
              <MyButton
                style={styles.settingsButton}
                icon='cog'
                size={28}
                whenPressed={showModal}
              >
                SETTINGS
              </MyButton>
            </View>
          </View>
        )) ||
          (currentScreen === 'flash' && (
            <FlashScreen
              returnTap={returnTap}
              message={choppedMessage}
              displayHeight={windowHeight}
              displayWidth={windowWidth}
              duration={750}
            />
          )) ||
          (currentScreen === 'scroll' && (
            <ScrollMessage returnTap={returnTap} message={text} />
          ))}
      </>
    </PaperProvider>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.alt2Bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleText: {
    fontSize: 48,
    color: '#ffffff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  versionText: {
    fontSize: 18,
    color: '#ffffff60',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#6200EE',
    marginBottom: 10,
    width: '80%',
  },
  clearButton: {
    backgroundColor: '#FF5733',
    marginBottom: 10,
    width: '80%',
  },
  modeButton: {
    marginBottom: 10,
    width: '80%',
  },
  settingsButton: {
    backgroundColor: '#2196F3',
    marginBottom: 10,
    width: '80%',
  },
  modalContainerStyle: {
    flex: 1,
  },
});
