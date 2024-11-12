import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import InputBox from '../components/InputBox';
import FlashScreen from './FlashScreen';
import COLORS from '../values/COLORS';
import GridButtons from '../components/GridButtons';
import availableColors from '../values/COLORS';

const backgroundImg = require('../../assets/img/flashtext_bg1.jpg');

const Main = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('main');
  const [flashType, setFlashType] = useState('plain');
  const [duration, setDuration] = useState(1000);
  const [choppedMessage, setChoppedMessage] = useState([]);
  const [userBgColor, setUserBgColor] = useState(0);
  const [randomizeBgColor, setRandomizeBgColor] = useState(false);
  const [text, setText] = useState('This is FlashText!');
  const [messageHistory, setMessageHistory] = useState([]);
  const [userFont, setUserFont] = useState('Russo');
  const [selectedItems, setSelectedItems] = useState([
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [titleFontSize, setTitleFontSize] = useState(58);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  // Define the available fonts
  /*************  ✨ Codeium Command 🌟  *************/
  const availableFonts = [
    'Kablammo',
    'Bubblegum',
    'Coustard',
    'Fascinate',
    'Russo',
    'Grenze',
    'Jollylodger',
    'Monofett',
    'Roboto',
    'Monoton',
  ];

  useEffect(() => {
    const loadBackgroundImage = async () => {
      await SplashScreen.preventAutoHideAsync();
      const backgroundImg = require('../../assets/img/flashtext_bg9.jpg');
      setIsLoaded(true);
      await SplashScreen.hideAsync();
    };
    loadBackgroundImage();
  }, []);

  if (!isLoaded) {
    return null;
  }

  /******  3e111db0-7247-47e5-b714-6b4486d9b74f  *******/

  /**
   * Handler for when the user presses the "Start" button.
   * If there is no text entered, alert the user.
   * If the text is not already in the message history, add it.
   * Set the chopped message to an array of words from the text.
   * Switch to the flash screen.
   */
  const startPressed = () => {
    if (!text) {
      alert('Enter some text first!');
      return;
    }
    // check that text does not match any entry in history
    if (!messageHistory.includes(text)) {
      // if messageHistory is longer than 50, remove the first element
      if (messageHistory.length >= 50) {
        messageHistory.shift();
      }
      setMessageHistory((prevHistory) => [...prevHistory, text]);
    }
    setChoppedMessage(text.split(' '));
    setCurrentScreen('flash');
  };

  const returnTap = () => setCurrentScreen('main');

  const handleInput = (enteredText) => {
    console.log(text);
    setText(enteredText);
  };

  const cancelInput = () => {
    setText('');
  };

  const handleHistoryPress = () => {
    if (messageHistory.length === 0) {
      Alert.alert('No History', 'No history yet');
      return;
    }
    setIsHistoryModalVisible(true);
  };

  const handleHistoryItemPress = (message) => {
    setText(message);
    setIsHistoryModalVisible(false);
  };

  // Function to handle font change
  const handleFontChange = () => {
    const currentIndex = availableFonts.indexOf(userFont);
    const nextIndex = (currentIndex + 1) % availableFonts.length;
    setUserFont(availableFonts[nextIndex]);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            setMessageHistory([]);
            setIsHistoryModalVisible(false);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleItem = (index) => {
    if (index == 0 || index == 2 || index == 4) {
      index == 0
        ? setFlashType('plain')
        : index == 2
        ? setFlashType('swoosh')
        : setFlashType('stretch');
    }

    if (index == 1) {
      if (randomizeBgColor) {
        setUserBgColor(0);
        setRandomizeBgColor(false);
        return;
      } else if (userBgColor < availableColors.length - 1) {
        setUserBgColor(userBgColor + 1);
        return;
      } else {
        setUserBgColor(availableColors.length - 1);
        setRandomizeBgColor(true);
      }
      return;
    }

    if (index == 3) {
      if (duration < 4000) {
        setDuration(duration + 500);
      } else {
        setDuration(500);
      }
      return;
    }

    if (index == 5) {
      handleHistoryPress();
      return;
    }

    setSelectedItems((prevSelectedItems) => {
      const updatedItems = [...prevSelectedItems];
      if ([0, 2, 4].includes(index)) {
        if (prevSelectedItems[index]) {
          return prevSelectedItems;
        }
        updatedItems[0] = false;
        updatedItems[2] = false;
        updatedItems[4] = false;
        updatedItems[index] = true;
      } else {
        updatedItems[index] = !prevSelectedItems[index];
      }
      return updatedItems;
    });
  };

  const measureTitle = (event) => {
    const containerWidth = event.nativeEvent.layout.width;
    const containerHeight = event.nativeEvent.layout.height;

    // Start with initial size and adjust down if needed
    let fontSize = Math.min(containerWidth / 4, containerHeight * 0.8);
    setTitleFontSize(fontSize);
  };

  return (
    <PaperProvider>
      <StatusBar
        backgroundColor={COLORS.darkBg}
        barStyle='light-content'
        hidden={currentScreen !== 'main'}
      />
      {currentScreen === 'main' ? (
        <ImageBackground source={backgroundImg} style={styles.background}>
          <View
            style={[
              styles.container,
              { paddingTop: StatusBar.currentHeight + 40 },
            ]}
          >
            <View style={styles.contentContainer}>
              <View style={styles.upperScreenContainer}>
                <View style={styles.titleContainer} onLayout={measureTitle}>
                  <Text
                    style={[
                      styles.titleText,
                      {
                        fontFamily: userFont,
                        fontSize: titleFontSize,
                      },
                    ]}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                  >
                    FlashText
                  </Text>
                  <Text style={styles.subTitleText}>2.0</Text>
                </View>
                <View style={styles.inputContainer}>
                  <InputBox
                    text={text}
                    handleInput={handleInput}
                    cancelInput={cancelInput}
                  />
                </View>
                <GridButtons
                  selectedItems={selectedItems}
                  toggleItem={toggleItem}
                  flashType={flashType}
                  userBgColor={userBgColor}
                  randomizeBgColor={randomizeBgColor}
                  duration={duration}
                  onHistoryPress={handleHistoryPress}
                  onFontChange={handleFontChange}
                  onStartPress={startPressed}
                  hasText={text.length > 0}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <FlashScreen
          returnTap={returnTap}
          message={choppedMessage}
          displayHeight={windowHeight}
          displayWidth={windowWidth}
          duration={duration}
          flashType={flashType}
          swooshDirection={'random'}
          userBgColor={availableColors[userBgColor]}
          randomizeBgColor={randomizeBgColor}
          fontSizeFactor={0.7}
          userFont={userFont}
        />
      )}
      <Modal
        visible={isHistoryModalVisible}
        transparent={true}
        onRequestClose={() => setIsHistoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {messageHistory.length > 0 && (
              <Pressable
                onPress={handleClearHistory}
                style={styles.clearHistoryButton}
              >
                <Text style={styles.clearHistoryText}>Clear History</Text>
              </Pressable>
            )}
            <ScrollView style={styles.historyScrollView}>
              {messageHistory.map((message, index) => (
                <Pressable
                  key={index}
                  style={styles.historyItem}
                  onPress={() => handleHistoryItemPress(message)}
                >
                  <Text style={styles.historyItemText}>{message}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              onPress={() => setIsHistoryModalVisible(false)}
              style={styles.returnButton}
            >
              <Text style={styles.returnButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </PaperProvider>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 6,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  upperScreenContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 2,
    marginVertical: 10,
  },
  titleContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    height: 75,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  titleText: {
    fontWeight: 'bold',
    color: '#8f027c',
    width: '100%',
    textAlign: 'center',
  },
  subTitleText: {
    fontSize: 14,
    color: '#ffffff6e',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  inputContainer: {
    width: '85%',
    height: 70,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#27273b',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  historyScrollView: {
    width: '100%',
    marginVertical: 20,
  },
  historyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyItemText: {
    color: '#fff',
    fontSize: 16,
  },
  returnButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    width: '50%',
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearHistoryButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  clearHistoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    resizeMode: 'contain',
  },
});
