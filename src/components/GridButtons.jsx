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

const randomImg = require('../../assets/img/randomImg.png');

const defaultGridButtonColor = '#ffffff00';

const availableColors = [
  '#04eb04',
  '#0606e7',
  '#f2de07',
  '#FF4500',
  '#f203f2',
  '#000000',
  '#ffffff',
];

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
        {[
          { name: 'fit-to-screen', label: 'Plain' },
          { name: 'stretch-to-page', label: 'Stretch' },
          { name: 'weather-windy', label: 'Swoosh' },
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
            <Icon
              name={item.name}
              size={43}
              color={
                selectedItems[index === 0 ? 0 : index === 1 ? 4 : 2]
                  ? '#fff'
                  : '#874bac'
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
          <View style={styles.durationContainer}>
            <Animated.View
              style={[
                styles.durationIndicator,
                {
                  transform: [{ rotate: spinValue }],
                },
              ]}
            >
              <Icon
                name='clock-outline'
                size={43}
                color={selectedItems[3] ? '#fff' : '#874bac'}
                style={styles.durationIcon}
              />
            </Animated.View>
            <Text
              style={[
                styles.gridItemText,
                selectedItems[3] && styles.selectedText,
              ]}
            >
              {`${duration / 1000}s`}
            </Text>
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
          <Icon
            name='format-color-fill'
            size={43}
            color={selectedItems[1] ? '#fff' : '#874bac'}
          />
          <Text
            style={[
              styles.gridItemText,
              selectedItems[1] && styles.selectedText,
            ]}
          >
            Background
          </Text>
        </Pressable>

        <Pressable
          onPress={onHistoryPress}
          style={({ pressed }) => [styles.gridItem, pressed && styles.pressed]}
        >
          <Icon name='home-outline' size={43} color='#874bac' />
          <Text style={styles.gridItemText}>History</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Pressable
          onPress={onFontChange}
          style={({ pressed }) => [styles.gridItem, pressed && styles.pressed]}
        >
          <Icon name='format-font' size={43} color='#874bac' />
          <Text style={styles.gridItemText}>FONTS</Text>
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
                size={43}
                color={hasText ? '#04eb04' : '#874bac'}
                style={{ marginRight: 14 }}
              />
              <Text
                style={[styles.gridItemText, hasText && styles.activeStartText]}
              >
                START
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    width: '90%',
    gap: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 15,
  },
  gridItem: {
    width: 106,
    height: 106,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gridItemWide: {
    width: 227,
    height: 106,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  selected: {
    backgroundColor: '#874bac',
    borderColor: '#fff',
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
    color: '#874bac',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
  },
  selectedText: {
    color: '#fff',
  },
  startButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStartText: {
    color: '#04eb04',
  },
  durationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  durationIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationIcon: {
    position: 'absolute',
    top: 10,
  },
});

export default GridButtons;
