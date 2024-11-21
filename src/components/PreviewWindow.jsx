import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/*
 * PreviewWindow Responsive Layout Notes
 * -----------------------------------
 * Challenge: Adapt the preview window for iPad landscape mode while maintaining
 * proper display in all other orientations
 * 
 * Attempted Solutions:
 * 1. Dynamic Dimensions:
 *    - Portrait: 75% of window width, 35% of window height
 *    - Landscape: 90% of window width, 50% of window height
 *    - Non-iPad: 90% width, fixed 180px height
 * 
 * 2. Margin Adjustments:
 *    - Tried removing top margin in landscape
 *    - Adjusted bottom margin for iPad vs non-iPad
 *    - Attempted to maintain proper spacing in all orientations
 * 
 * 3. Size Calculations:
 *    - Used window.width and window.height for responsive calculations
 *    - Attempted to maintain proper aspect ratio
 *    - Adjusted preview area based on orientation
 * 
 * Known Issues:
 *    - Preview might be cut off in some orientations
 *    - Text sizing calculations may need refinement
 *    - Container dimensions might need different approach for landscape
 */

// Get dimensions from window
const window = Dimensions.get('window');
const isIPad = Platform.isPad;
const isPortrait = window.height > window.width;
const isLandscape = window.width > window.height;

// Modify dimensions for iPad in both portrait and landscape mode
const PREVIEW_WIDTH = isIPad ? (isLandscape ? window.width * 0.9 : window.width * 0.75) : window.width * 0.9;
const PREVIEW_HEIGHT = isIPad ? (isLandscape ? window.height * 0.5 : window.height * 0.35) : 180;

const PreviewWindow = ({
  text,
  selectedAnimation,
  selectedFont,
  selectedColor,
  isKeyboardVisible,
  randomImg,
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [previewCount, setPreviewCount] = useState(0);
  const animationRef = useRef(null);
  const isAnimating = useRef(false);
  const [textSize, setTextSize] = useState(24);

  // Reset preview count when text changes
  useEffect(() => {
    if (text) {
      setWords(text.split(/\s+/).filter(word => word.length > 0));
      setPreviewCount(0);
      setCurrentWordIndex(0);
      isAnimating.current = false;
    } else {
      setWords([]);
      setPreviewCount(0);
      setCurrentWordIndex(0);
    }
  }, [text]);

  // Reset animation values when animation type or color changes
  useEffect(() => {
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
    moveAnim.setValue(0);
    setCurrentWordIndex(0);
    setPreviewCount(0);
    isAnimating.current = false;

    // Cleanup animations when component unmounts or animation type changes
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [selectedAnimation, selectedColor]);

  const animate = useCallback(() => {
    if (!words.length || isKeyboardVisible || previewCount >= 2 || isAnimating.current) {
      return;
    }

    isAnimating.current = true;
    
    // Reset animations with safety checks
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
    moveAnim.setValue(0);

    // Create animation based on selected type
    let wordAnimation;
    switch (selectedAnimation) {
      case 'stretch':
        wordAnimation = Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]);
        break;
      case 'swoosh':
        wordAnimation = Animated.sequence([
          Animated.timing(moveAnim, {
            toValue: 30,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim, {
            toValue: -30,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(moveAnim, {
            toValue: 0,
            tension: 40,
            friction: 5,
            useNativeDriver: true,
          }),
        ]);
        break;
      default: // plain
        wordAnimation = Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 500,
          useNativeDriver: true,
        });
    }

    // Stop any existing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // Run animation sequence
    animationRef.current = Animated.sequence([
      wordAnimation,
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);

    animationRef.current.start(({ finished }) => {
      if (!finished) return;
      
      isAnimating.current = false;
      const nextIndex = (currentWordIndex + 1) % words.length;
      if (nextIndex === 0) {
        setPreviewCount(prev => prev + 1);
      }
      if (previewCount < 2) {
        setCurrentWordIndex(nextIndex);
      }
    });
  }, [currentWordIndex, words, selectedAnimation, isKeyboardVisible, previewCount]);

  // Trigger animation when conditions are right
  useEffect(() => {
    if (!isKeyboardVisible && words.length > 0 && previewCount < 2) {
      animate();
    }
  }, [currentWordIndex, isKeyboardVisible, animate]);

  // Calculate appropriate text size based on word length
  const calculateTextSize = useCallback((word) => {
    if (!word) return 24;
    const PREVIEW_WIDTH = (isIPad && isPortrait) ? window.width * 0.75 : window.width * 0.8; // 80% of preview width for padding
    const PREVIEW_HEIGHT = (isIPad && isPortrait) ? window.height * 0.7 : 100; // Preview height minus padding
    const BASE_SIZE = 24;
    
    // Estimate width per character (varies by font)
    const CHAR_WIDTH_RATIO = 0.6; // Approximate width/height ratio
    const estimatedWidth = word.length * BASE_SIZE * CHAR_WIDTH_RATIO;
    
    // Scale based on width or height constraints
    const widthScale = PREVIEW_WIDTH / estimatedWidth;
    const heightScale = PREVIEW_HEIGHT / BASE_SIZE;
    
    // Use the more constraining scale
    const scale = Math.min(widthScale, heightScale, 2.5); // Cap at 2.5x base size
    
    return Math.max(Math.floor(BASE_SIZE * scale), 16); // Min size 16px
  }, []);

  // Update text size when word changes
  useEffect(() => {
    if (words[currentWordIndex]) {
      setTextSize(calculateTextSize(words[currentWordIndex]));
    }
  }, [currentWordIndex, words, calculateTextSize]);

  // Calculate luminance of background color to determine text color
  const getTextColor = useCallback((bgColor) => {
    if (selectedColor === 'random' || !bgColor) {
      return 'rgba(255, 255, 255, 0.95)';
    }

    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate relative luminance using sRGB coefficients
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark backgrounds, dark for light backgrounds
    return luminance > 0.5 ? 'rgba(20, 20, 40, 0.85)' : 'rgba(255, 255, 255, 0.95)';
  }, [selectedColor]);

  const getBackgroundStyle = () => {
    if (selectedColor === 'random') {
      return {
        backgroundColor: 'transparent',
      };
    }
    return {
      backgroundColor: selectedColor,
    };
  };

  const getRandomGradient = () => {
    // Creative gradient colors that suggest randomness and creativity
    return [
      'rgba(64, 145, 247, 0.8)',  // Bright blue
      'rgba(130, 87, 229, 0.8)',  // Purple
      'rgba(255, 135, 66, 0.8)',  // Orange
      'rgba(46, 197, 122, 0.8)',  // Green
    ];
  };

  const renderPreviewContent = () => {
    if (words.length > 0 && previewCount < 2) {
      const safeScale = isNaN(scaleAnim.__getValue()) ? 1 : scaleAnim;
      const safeMove = isNaN(moveAnim.__getValue()) ? 0 : moveAnim;
      const safeFade = isNaN(fadeAnim.__getValue()) ? 1 : fadeAnim;
      
      return (
        <Animated.Text
          style={[
            styles.previewText,
            {
              fontFamily: selectedFont,
              fontSize: textSize,
              color: getTextColor(selectedColor),
              opacity: safeFade,
              transform: [
                { scale: safeScale },
                { translateX: safeMove },
              ],
            },
          ]}
        >
          {words[currentWordIndex]}
        </Animated.Text>
      );
    }
    
    return (
      <View style={styles.placeholderContainer}>
        <Text style={[
          styles.placeholderText,
          { color: getTextColor(selectedColor) }
        ]}>
          {words.length > 0 ? 'Preview Complete' : selectedColor === 'random' ? 'Random Colors' : 'Preview Area'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.previewArea,
          selectedColor === 'random' ? styles.gradient : getBackgroundStyle(),
          styles.solidColorPreview
        ]}
      >
        {selectedColor === 'random' && (
          <LinearGradient
            colors={getRandomGradient()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Text style={[styles.previewLabel, { color: getTextColor(selectedColor) }]}>
          Preview
        </Text>
        <View style={styles.previewContent}>
          {renderPreviewContent()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: PREVIEW_WIDTH,
    height: PREVIEW_HEIGHT,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: isIPad ? 40 : 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    padding: 2,
    borderRadius: 15,
  },
  previewArea: {
    flex: 1,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontStyle: 'italic',
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  startIconContainer: {
    marginLeft: 8,
    marginTop: 4,
  },
  solidColorPreview: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewLabel: {
    position: 'absolute',
    top: 4,
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
});

export default PreviewWindow;
