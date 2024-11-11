import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FunButton = () => {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.8}>
      <View style={styles.buttonContent}>
        <Text style={styles.sparkle}>✨</Text>
        <LinearGradient
          colors={['#ff00ff', '#8a2be2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.textContainer}
        >
          <Text style={styles.buttonText}>Tap Me!</Text>
        </LinearGradient>
        <Text style={styles.sparkle}>✨</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 116,
    height: 106,
    backgroundColor: 'rgba(18, 128, 245, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    borderRadius: 8,
    padding: 4,
    margin: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  sparkle: {
    fontSize: 24,
  },
});

export default FunButton;
