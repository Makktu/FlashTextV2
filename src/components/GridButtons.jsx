import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ImageBackground,
  Animated,
  Easing,
  Alert,
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
  const startButtonAnim = useRef(new Animated.Value(0)).current;

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

    if (hasText) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(startButtonAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(startButtonAnim, {
            toValue: 0.7,
            duration: 600,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      startButtonAnim.setValue(0.4);
    }
  }, [hasText, duration]);

  const animatedStyle = {
    backgroundColor: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        hasText ? 'rgba(0, 144, 255, 0.4)' : 'rgba(40, 40, 40, 0.3)',
        hasText ? 'rgba(0, 144, 255, 0.9)' : 'rgba(40, 40, 40, 0.3)',
      ],
    }),
    borderColor: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.5)'],
    }),
  };

  const spinValue = durationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const startButtonStyle = {
    transform: [{ scale: startButtonAnim }],
    backgroundColor: hasText
      ? 'rgba(0, 144, 255, 0.9)'
      : 'rgba(40, 40, 40, 0.3)',
  };

  return (
    <View style={styles.gridContainer}>
      <View style={styles.row}>
        <Pressable
          onPress={onFontChange}
          style={({ pressed }) => [styles.gridItem, pressed && styles.pressed]}
        >
          <View style={styles.buttonInner}>
            <View style={styles.buttonContent}>
              <Icon
                name="format-font"
                size={44}
                color="rgba(40, 50, 65, 1.0)"
              />
              <Text style={styles.gridItemText}>FONTS</Text>
            </View>
          </View>
        </Pressable>

        <Animated.View style={[styles.startButton, animatedStyle]}>
          <Pressable
            onPress={() => {
              if (!hasText) {
                Alert.alert(
                  'No Text',
                  'Please enter some text before starting the animation.',
                  [{ text: 'OK' }]
                );
                return;
              }
              onStartPress();
            }}
            style={({ pressed }) => [
              styles.startButtonInner,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.customButtonInner}>
              <Icon
                name="play"
                size={96}
                color={hasText ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 20, 40, 0.3)'}
                style={[
                  { marginRight: 14 },
                  hasText && {
                    shadowColor: 'rgba(255, 255, 255, 0.95)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                  }
                ]}
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
                  scaleX: stretchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
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
              <View style={styles.buttonContent}>
                <Animated.View style={item.style}>
                  <Icon
                    name={item.name}
                    size={44}
                    color={
                      selectedItems[index === 0 ? 0 : index === 1 ? 4 : 2]
                        ? 'rgba(0, 90, 180, 0.95)'
                        : 'rgba(40, 50, 65, 1.0)'
                    }
                  />
                </Animated.View>
                <Text
                  style={[
                    styles.gridItemText,
                    selectedItems[index === 0 ? 0 : index === 1 ? 4 : 2] &&
                      styles.selectedText,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
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
                name="clock-outline"
                size={44}
                color="rgba(40, 50, 65, 1.0)"
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
            {!randomizeBgColor && (
              <View style={styles.colorButtonContent}>
                <Icon
                  name="palette"
                  size={44}
                  color={availableColors[userBgColor]}
                  style={{ opacity: 1.0 }}
                />
                <Text style={styles.gridItemText}>COLORS</Text>
              </View>
            )}
            {randomizeBgColor && (
              <View style={styles.colorButtonContent}>
                <Icon
                  name="shuffle-variant"
                  size={44}
                  color="rgba(40, 50, 65, 1.0)"
                />
                <Text style={styles.gridItemText}>RANDOM</Text>
              </View>
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
            <Icon
              name="history"
              size={44}
              color="rgba(40, 50, 65, 1.0)"
            />
            <Text style={styles.gridItemText}>HISTORY</Text>
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: 'rgba(140, 150, 170, 0.25)',
    borderRadius: 15,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  buttonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  gridItemText: {
    color: 'rgba(40, 50, 65, 0.9)',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  startButton: {
    width: '64.5%',  // Spans two grid items (31% * 2) plus the gap between them
    height: 108,
    borderRadius: 20,
    backgroundColor: 'rgba(140, 150, 170, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  selected: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(0, 180, 85, 0.6)',
  },
  colorButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  colorIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedText: {
    color: 'rgba(0, 90, 180, 0.95)',
    fontWeight: '700',
  },
  startButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 19,
    backdropFilter: 'blur(10px)',
    margin: 0,
    transition: '0.3s',
  },
  customButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  durationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});

export default GridButtons;
