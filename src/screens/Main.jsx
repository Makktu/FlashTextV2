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
import InputBox from '../components/InputBox';
import FlashScreen from './FlashScreen';
import COLORS from '../values/COLORS';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const [duration, setduration] = useState(2000); // ms
  const [choppedMessage, setChoppedMessage] = useState([]);
  const [text, setText] = useState('');
  const [selectedItems, setSelectedItems] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
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
    setSelectedItems((prevSelectedItems) => {
      const updatedItems = [...prevSelectedItems];
      updatedItems[index] = !updatedItems[index];
      return updatedItems;
    });
  };

  return (
    <PaperProvider>
      <StatusBar backgroundColor={COLORS.darkBg} barStyle='light-content' />
      {(currentScreen === 'main' && (
        <View style={styles.container}>
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
                onPress: handlePlainPress,
              },
              { name: 'format-color-fill', label: 'Random Colours' },
              { name: 'weather-windy', label: 'Swoosh' },
              { name: 'fast-forward', label: `Speed: ${duration / 1000}s` },
              { name: 'stretch-to-page', label: 'Stretch' },
              { name: 'home-outline', label: 'History' },
            ].map((item, index) => (
              <Pressable
                key={index}
                onPress={() => toggleItem(index)}
                style={[
                  styles.gridItem,
                  {
                    backgroundColor: selectedItems[index]
                      ? '#28a745'
                      : '#27273b',
                  }, // Toggle between green and default
                ]}
              >
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
            duration={750}
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
