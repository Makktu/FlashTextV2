import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ImageBackground,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import availableColors from '../values/COLORS';

const randomImg = require('../../assets/img/randomImg.png');
const defaultGridButtonColor = '#ffffff00';
const plainBtnAnimSpeed = 3000;
const stretchBtnAnimSpeed = 3000;
const swooshBtnAnimSpeed = 3000;

const GridButtons = ({
  selectedItems,
  toggleItem,
  flashType,
  userBgColor,
  randomizeBgColor,
  duration,
  onHistoryPress,
  onFontChange,
  onStartPress,
  hasText,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const durationAnim = useRef(new Animated.Value(0)).current;
  const plainAnim = useRef(new Animated.Value(0)).current;
  const stretchAnim = useRef(new Animated.Value(0)).current;
  const swooshAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hasText) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(durationAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(durationAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    console.log(flashType);

    Animated.loop(
      Animated.sequence([
        Animated.timing(plainAnim, {
          toValue: 1,
          duration: plainBtnAnimSpeed / 2,
          useNativeDriver: true,
        }),
        Animated.timing(plainAnim, {
          toValue: 0,
          duration: plainBtnAnimSpeed / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(stretchAnim, {
          toValue: 1,
          duration: stretchBtnAnimSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(stretchAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(swooshAnim, {
          toValue: 1,
          duration: swooshBtnAnimSpeed / 2,
          useNativeDriver: true,
        }),
        Animated.timing(swooshAnim, {
          toValue: 2,
          duration: swooshBtnAnimSpeed / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [hasText, duration]);

  const animatedStyle = {
    backgroundColor: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 255, 255, 0.1)', 'rgba(4, 235, 4, 0.2)'],
    }),
    borderColor: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 255, 255, 0.2)', 'rgba(4, 235, 4, 0.5)'],
    }),
  };

  const spinValue = durationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.gridContainer}>
      <View style={styles.row}>
        <Pressable
          onPress={onFontChange}
          style={({ pressed }) => [styles.gridItem, pressed && styles.pressed]}
        >
          <View style={styles.buttonInner}>
            <Icon name='format-font' size={43} color='#FFFFFF' />
            <Text style={styles.gridItemText}>FONTS</Text>
          </View>
        </Pressable>

        <Animated.View style={[styles.gridItemWide, animatedStyle]}>
          <Pressable
            onPress={onStartPress}
            style={({ pressed }) => [
              styles.startButtonInner,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.customButtonInner}>
              <Icon
                name='play'
                size={104}
                color={hasText ? '#04eb04' : '#FFFFFF'}
                style={{ marginRight: 14 }}
              />
            </View>
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.row}>
        {[
          {
            name: 'fit-to-screen',
            label: 'Plain',
            anim: plainAnim,
            style: {
              opacity: plainAnim,
            },
          },
          {
            name: 'stretch-to-page',
            label: 'Stretch',
            anim: stretchAnim,
            style: {
              transform: [
                {
                  scale: stretchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.2],
                  }),
                },
              ],
            },
          },
          {
            name: 'weather-windy',
            label: 'Swoosh',
            anim: swooshAnim,
            style: {
              transform: [
                {
                  translateX: swooshAnim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [-50, 0, 50],
                  }),
                },
              ],
            },
          },
        ].map((item, index) => (
          <Pressable
            key={index}
            onPress={() => toggleItem(index === 0 ? 0 : index === 1 ? 4 : 2)}
            style={({ pressed }) => [
              styles.gridItem,
              pressed && styles.pressed,
              selectedItems[index === 0 ? 0 : index === 1 ? 4 : 2] &&
                styles.selected,
            ]}
          >
            <View style={styles.buttonInner}>
              <Animated.View style={item.style}>
                <Icon
                  name={item.name}
                  size={43}
                  color={
                    selectedItems[index === 0 ? 0 : index === 1 ? 4 : 2]
                      ? '#FFFFFF'
                      : '#FFFFFF'
                  }
                />
                <Text
                  style={[
                    styles.gridItemText,
                    selectedItems[index === 0 ? 0 : index === 1 ? 4 : 2] &&
                      styles.selectedText,
                  ]}
                >
                  {item.label}
                </Text>
              </Animated.View>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        <Pressable
          onPress={() => toggleItem(3)}
          style={({ pressed }) => [
            styles.gridItem,
            pressed && styles.pressed,
            selectedItems[3] && styles.selected,
          ]}
        >
          <View style={styles.buttonInner}>
            <View
              style={[styles.durationContainer, { flexDirection: 'column' }]}
            >
              <Icon
                name='clock-outline'
                size={43}
                color={selectedItems[3] ? '#FFFFFF' : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.gridItemText,
                  selectedItems[3] && styles.selectedText,
                ]}
              >
                {`${duration / 1000}s`}
              </Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          onPress={() => toggleItem(1)}
          style={({ pressed }) => [
            styles.gridItem,
            pressed && styles.pressed,
            selectedItems[1] && styles.selected,
          ]}
        >
          <View style={styles.buttonInner}>
            {randomizeBgColor ? (
              <ImageBackground
                source={randomImg}
                style={styles.randomBackground}
                imageStyle={styles.randomBackgroundImage}
              />
            ) : (
              <View
                style={[
                  styles.colorIndicator,
                  { backgroundColor: availableColors[userBgColor] },
                ]}
              />
            )}

            {!randomizeBgColor && (
              <>
                <Icon
                  name='format-color-fill'
                  size={43}
                  color={selectedItems[1] ? '#FFFFFF' : '#FFFFFF'}
                />
                <Text
                  style={[
                    styles.gridItemText,
                    selectedItems[1] && styles.selectedText,
                  ]}
                >
                  Background
                </Text>
              </>
            )}
          </View>
        </Pressable>

        <Pressable
          onPress={() => toggleItem(5)}
          style={({ pressed }) => [
            styles.gridItem,
            pressed && styles.pressed,
            selectedItems[5] && styles.selected,
          ]}
        >
          <View style={styles.buttonInner}>
            <Icon name='history' size={43} color='#FFFFFF' />
            <Text style={styles.gridItemText}>History</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    marginTop: 30,
    width: '90%',
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 15,
  },
  gridItem: {
    width: 106,
    height: 116,
    borderRadius: 26,
    // backgroundColor: '#FF69B4', // Hot pink color
    backgroundColor: '#e006ec44',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  buttonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f309d0a9',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    margin: 2,
  },
  gridItemWide: {
    width: 227,
    height: 116,
    borderRadius: 26,
    backgroundColor: '#ff69b444',
    position: 'relative',
    overflow: 'hidden',
    // borderWidth: 4,
    // borderColor: '#000000',
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 8,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  selected: {
    backgroundColor: '#3d0523', // Darker pink (#ff1493)
    borderColor: '#ffffff',
  },
  randomBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  randomBackgroundImage: {
    borderRadius: 23,
  },
  colorIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 23,
    opacity: 0.5,
  },
  gridItemText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  startButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d26fe1',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255, 255,, 0.3)',
    margin: 2,
  },
  customButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});

export default GridButtons;
