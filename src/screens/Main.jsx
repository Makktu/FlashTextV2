import React, { useState } from 'react';
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
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground } from 'react-native';
import InputBox from '../components/InputBox';
import FlashScreen from './FlashScreen';
import COLORS from '../values/COLORS';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const availableColors = [
  '#04eb04',
  '#0606e7',
  '#f2de07',
  '#FF4500',
  '#f203f2',
  '#000000',
  '#ffffff',
];

const randomImg = require('../../assets/img/randomImg.png');

const CustomButton = ({ children, onPress, style }) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.customButton, style, pressed && styles.pressed]}>
          <Icon
            name='play-box'
            size={44}
            color={COLORS.white}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.customButtonText}>{children}</Text>
        </View>
      )}
    </Pressable>
  );
};

const Main = () => {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [flashType, setFlashType] = useState('plain');
  const [duration, setDuration] = useState(2000);
  const [choppedMessage, setChoppedMessage] = useState([]);
  const [userBgColor, setUserBgColor] = useState(0);
  const [randomizeBgColor, setRandomizeBgColor] = useState(false);
  const [text, setText] = useState('This is FlashText!');
  const [messageHistory, setMessageHistory] = useState([]);
  const [userFont, setUserFont] = useState('Roboto');
  const [selectedItems, setSelectedItems] = useState([
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  // Define the available fonts
  /*************  ✨ Codeium Command 🌟  *************/
  const availableFonts = [
    'Kablammo',
    'Bubblegum',
    'Caveat',
    'Fascinate',
    'Russo',
    'Grenze',
    'Jollylodger',
    'Monofett',
    'Roboto',
    'Monoton',
  ];

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
      } else if (userBgColor < availableColors.length - 2) {
        setUserBgColor(userBgColor + 1);
        return;
      } else {
        setUserBgColor(availableColors.length - 1);
        setRandomizeBgColor(true);
      }
      return;
    }

    if (index == 3) {
      if (duration < 5000) {
        setDuration(duration + 1000);
      } else {
        setDuration(1000);
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

  return (
    <PaperProvider>
      <StatusBar backgroundColor={COLORS.darkBg} barStyle='light-content' />
      {currentScreen === 'main' ? (
        <View style={styles.container}>
          <LinearGradient
            colors={['#37222d', '#360e43']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <Modal
            visible={isHistoryModalVisible}
            transparent={true}
            animationType='slide'
            onRequestClose={() => setIsHistoryModalVisible(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setIsHistoryModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <Pressable
                  style={styles.clearHistoryButton}
                  onPress={handleClearHistory}
                >
                  <Text style={styles.clearHistoryText}>Clear History</Text>
                </Pressable>

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
                  style={styles.returnButton}
                  onPress={() => setIsHistoryModalVisible(false)}
                >
                  <Text style={styles.returnButtonText}>Return</Text>
                </Pressable>
              </View>
            </Pressable>
          </Modal>

          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, { fontFamily: userFont }]}>
              FlashText
            </Text>
            <Text style={styles.subTitleText}>2.0</Text>
          </View>

          <View style={styles.fontButtonContainer}>
            <Pressable style={styles.fontButton} onPress={handleFontChange}>
              <Icon name='format-font' size={24} color={COLORS.white} />
              <Text style={styles.fontButtonText}>Change the Font</Text>
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <InputBox text={text} handleInput={handleInput} />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton onPress={startPressed} style={{ marginTop: 2 }}>
              START
            </CustomButton>
          </View>

          <View style={styles.gridContainer}>
            {[
              { name: 'fit-to-screen', label: 'Plain' },
              { name: 'format-color-fill', label: 'Background' },
              { name: 'weather-windy', label: 'Swoosh' },
              { name: 'fast-forward', label: `Duration: ${duration / 1000}s` },
              { name: 'stretch-to-page', label: 'Stretch' },
              { name: 'home-outline', label: 'History' },
            ].map((item, index) => (
              <Pressable
                key={index}
                onPress={() => toggleItem(index)}
                style={[
                  styles.gridItem,
                  index === 1 && randomizeBgColor
                    ? null
                    : {
                        backgroundColor:
                          index === 1
                            ? availableColors[userBgColor]
                            : selectedItems[index]
                            ? '#28a745'
                            : '#27273b',
                      },
                ]}
              >
                {index === 1 && randomizeBgColor ? (
                  <ImageBackground
                    source={randomImg}
                    style={[
                      styles.gridItem,
                      { position: 'absolute', width: '100%', height: '100%' },
                    ]}
                  />
                ) : null}
                <Icon name={item.name} size={40} color='#FFF' />
                <Text style={styles.gridItemText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
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
    </PaperProvider>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2d',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  titleContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    height: 75,
    overflow: 'hidden',
    // backgroundColor: 'green',
  },
  titleText: {
    fontSize: 58,
    fontWeight: 'bold',
    color: '#fefcfb',
  },
  subTitleText: {
    fontSize: 14,
    color: '#ffffff6e',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '90%',
  },
  gridItem: {
    width: 120,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    overflow: 'hidden', // Add this to ensure image doesn't overflow
    position: 'relative', // Add this to help with image positioning
  },
  gridItemText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  mainButton: {
    backgroundColor: '#5f4444',
    marginVertical: 18,
    paddingHorizontal: 30,
  },
  customButton: {
    width: 300,
    height: 80,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
  customButtonText: {
    fontSize: 38,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '85%',
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
  fontButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  fontButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },

  fontButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
