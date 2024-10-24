import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  Pressable,
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
  const [duration, setDuration] = useState(2000); // ms
  const [choppedMessage, setChoppedMessage] = useState([]);
  const [userBgColor, setUserBgColor] = useState(0);
  const [randomizeBgColor, setRandomizeBgColor] = useState(false);
  const [text, setText] = useState('This is FlashText!');
  const [selectedItems, setSelectedItems] = useState([
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  // const [pickedAnimation, setPickedAnimation] = useState('stretch');

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const startPressed = () => {
    if (!text) {
      alert('Enter some text first!');
      return;
    }
    setChoppedMessage(text.split(' '));
    setCurrentScreen('flash');
  };

  const returnTap = () => setCurrentScreen('main');

  const handleInput = (enteredText) => {
    console.log(text);
    setText(enteredText);
  };

  const modeChanged = () => {
    setCurrentScreen((prevMode) => (prevMode === 'flash' ? 'scroll' : 'flash'));
  };

  const handlePlainPress = () => {
    console.log('Plain Pressed');
  };
  // Handler for toggling the color of grid items
  const toggleItem = (index) => {
    if (index == 0 || index == 2 || index == 4) {
      index == 0
        ? setFlashType('plain')
        : index == 2
        ? setFlashType('swoosh')
        : setFlashType('stretch');
    }

    if (index == 1) {
      console.log(userBgColor);
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

    // SPEED CONTROLS
    if (index == 3) {
      if (duration < 5000) {
        setDuration(duration + 1000);
      } else {
        setDuration(1000);
      }
      return;
    }

    if (index == 5) {
      console.log('OPEN HISTORY MODAL OR WHATEVER LOL');
      return;
    }
    setSelectedItems((prevSelectedItems) => {
      const updatedItems = [...prevSelectedItems];

      // Check if the selected item is one of the special ones (0, 2, or 4)
      if ([0, 2, 4].includes(index)) {
        // If the clicked item is already green, do nothing
        if (prevSelectedItems[index]) {
          return prevSelectedItems;
        }

        // Set all special items (0, 2, and 4) to false
        updatedItems[0] = false;
        updatedItems[2] = false;
        updatedItems[4] = false;

        // Set the clicked item to true (make it green)
        updatedItems[index] = true;
      } else {
        // For non-special items, toggle them normally
        updatedItems[index] = !prevSelectedItems[index];
      }

      return updatedItems;
    });
  };

  return (
    <PaperProvider>
      <StatusBar backgroundColor={COLORS.darkBg} barStyle='light-content' />
      {(currentScreen === 'main' && (
        <View style={styles.container}>
          <LinearGradient
            // colors={['#0a0b19', '#060307']}
            colors={['#37222d', '#360e43']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Top Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>FlashText</Text>
            <Text style={styles.subTitleText}>Version 2.0</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <InputBox text={text} handleInput={handleInput} />
          </View>

          {/* START Button Section */}
          <View style={styles.buttonContainer}>
            <CustomButton onPress={startPressed} style={{ marginTop: 2 }}>
              START
            </CustomButton>
          </View>

          {/* Main Grid Section */}
          <View style={styles.gridContainer}>
            {[
              {
                name: 'fit-to-screen',
                label: 'Plain',
              },
              { name: 'format-color-fill', label: 'Background' },
              { name: 'weather-windy', label: 'Swoosh' },
              { name: 'fast-forward', label: `Duration: ${duration / 1000}s` },
              { name: 'stretch-to-page', label: 'Stretch' },
              { name: 'home-outline', label: 'History' },
            ].map((item, index) => (
              <Pressable
                key={index}
                onPress={() => toggleItem(index)}
                // style={[
                //   styles.gridItem,
                //   {
                //     backgroundColor:
                //       index === 1
                //         ? availableColors[userBgColor]
                //         : selectedItems[index]
                //         ? '#28a745'
                //         : '#27273b',
                //   }, // Toggle between green and default
                // ]}
                style={[
                  styles.gridItem,
                  index === 1 && randomizeBgColor
                    ? null // No background color when using image
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
      )) ||
        (currentScreen === 'flash' && (
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
          />
        ))}
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
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 58,
    fontWeight: 'bold',
    color: '#fefcfb',
  },
  subTitleText: {
    fontSize: 28,
    color: '#ffffff6e',
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
});
