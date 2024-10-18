// useEffect(() => {
//   // Function to get the current orientation and set it
//   const getOrientation = async () => {
//     const orientationLock = await ScreenOrientation.getOrientationAsync();
//     handleOrientationChange(orientationLock);
//   };

//   // Call function to set initial orientation
//   getOrientation();

//   // Set up listener for orientation changes
//   const subscription = ScreenOrientation.addOrientationChangeListener(
//     (evt) => {
//       const newOrientation = evt.orientationInfo.orientation;
//       handleOrientationChange(newOrientation);
//     }
//   );

//   // Cleanup listener on unmount
//   return () => {
//     ScreenOrientation.removeOrientationChangeListener(subscription);
//   };
// }, []);
// Function to update orientation state and apply UI changes
// const handleOrientationChange = (orientationValue) => {
//   switch (orientationValue) {
//     case ScreenOrientation.Orientation.PORTRAIT_UP:
//     case ScreenOrientation.Orientation.PORTRAIT_DOWN:
//       setOrientation('PORTRAIT');
//       break;
//     case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
//     case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
//       setOrientation('LANDSCAPE');
//       break;
//     default:
//       setOrientation('UNKNOWN');
//   }
//   console.log(orientation);
// };

// const [orientation, setOrientation] = useState('PORTRAIT'); // the default

// import * as ScreenOrientation from 'expo-screen-orientation';

// import { StyleSheet, Text, View } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import Animated, {
//   useSharedValue,
//   withSpring,
//   useAnimatedStyle,
//   withTiming,
// } from 'react-native-reanimated';

// export default function FlashMessage({
//   message,
//   duration,
//   displayHeight,
//   displayWidth,
// }) {
//   const [nextWord, setNextWord] = useState(0);

//   const scale = useSharedValue(0.5); // initial font scale value

//   // const width = useSharedValue(displayWidth / 2);
//   // let fontSize = useSharedValue(100);
//   // const expandFont = useSharedValue(50);
//   console.log(message);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ scale: scale.value }],
//     };
//   });

//   const animateText = () => {
//     // Animate the text from small to large (scale 2)
//     scale.value = withTiming(2, { duration: 1000 }); // Scale to large over 1 second
//     // setTimeout(animationFinished, 1000);
//   };

//   // const startAnimation = () => {
//   //   width.value = withSpring(width.value + (displayWidth - width.value));
//   //   fontSize.value = withSpring(
//   //     fontSize.value + (displayWidth - fontSize.value)
//   //   );
//   //   setTimeout(animationFinished, 1000);
//   // };

//   // const animationFinished = () => {
//   //   if (nextWord == message.length - 1) {
//   //     setNextWord(0);
//   //   } else {
//   //     setNextWord(nextWord + 1);
//   //   }
//   // };

//   useEffect(() => {
//     animateText(); // Start the animation when the component mounts
//   }, [nextWord]);

//   return (
//     <View style={styles.container}>
//       <Animated.Text style={[styles.messageText, animatedStyle]}>
//         {message[nextWord]}
//       </Animated.Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // borderColor: 'red',
//     // borderWidth: 2,
//   },
//   messageText: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 20, // initial font size
//     fontWeight: 'bold',
//   },
// });

// import { StyleSheet, View, Dimensions } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   runOnJS,
// } from 'react-native-reanimated';

// // Function to get the current screen dimensions and orientation
// const getScreenDimensions = () => {
//   const { width, height } = Dimensions.get('window');
//   const isPortrait = height > width; // Detect orientation
//   return { width, height, isPortrait };
// };

// export default function FlashMessage({
//   message,
//   duration = 750, // Animation duration
// }) {
//   const [nextWord, setNextWord] = useState(0); // Index of the current word
//   const [screenData, setScreenData] = useState(getScreenDimensions()); // Screen size and orientation

//   const scale = useSharedValue(0); // Start with the text invisible (scale 0)

//   // Function to calculate dynamic scale based on word length and screen size
//   const calculateScale = (word: string) => {
//     const wordLength = word.length;
//     const baseFontSize = 40; // Starting font size for words

//     // Calculate the maximum possible width and height based on orientation
//     const maxWidth = screenData.isPortrait
//       ? screenData.width
//       : screenData.width * 0.99; // Use 99% of width in landscape
//     const maxHeight = screenData.isPortrait
//       ? screenData.height * 0.9
//       : screenData.height * 0.9; // Adjust for height in both modes

//     // Calculate how much to scale based on word length, screen width, and height
//     const desiredFontSizeByWidth = (maxWidth * 2.95) / wordLength; // Make word 80% of available width
//     const desiredFontSizeByHeight = maxHeight / 0.5; // Limit by height to avoid overflowing

//     // Use the smaller of the two values to ensure the word fits both width and height
//     const desiredFontSize = Math.min(
//       desiredFontSizeByWidth,
//       desiredFontSizeByHeight
//     );

//     const scaleValue = desiredFontSize / baseFontSize; // Calculate the scale factor
//     return scaleValue;
//   };

//   // Animated style for the text
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ scale: scale.value }],
//     };
//   });

//   // Function to animate the text from small to large
//   const animateText = () => {
//     const currentWord = message[nextWord];
//     const dynamicScale = calculateScale(currentWord); // Get dynamic scale based on word length

//     // Animate scale from 0 (invisible) to dynamic scale
//     scale.value = withTiming(dynamicScale, { duration: duration }, () => {
//       scale.value = withTiming(1, { duration: duration }, () => {
//         // Once the animation finishes, move to the next word
//         runOnJS(animationFinished)();
//       });
//     });
//   };

//   // Function to update the next word when animation finishes
//   const animationFinished = () => {
//     if (nextWord === message.length - 1) {
//       setNextWord(0); // Loop back to the first word
//     } else {
//       setNextWord(nextWord + 1); // Move to the next word
//     }
//   };

//   // useEffect to run the animation whenever the word changes
//   useEffect(() => {
//     // Reset scale to 0 before starting the next word animation
//     scale.value = 0;
//     animateText(); // Start the animation
//   }, [nextWord, screenData]); // Re-run the effect when screen data changes

//   // Listener to update screen dimensions and orientation on resize
//   useEffect(() => {
//     const updateScreenData = () => {
//       setScreenData(getScreenDimensions());
//     };

//     const subscription = Dimensions.addEventListener(
//       'change',
//       updateScreenData
//     );

//     return () => {
//       subscription.remove(); // Clean up the event listener
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Animated.Text style={[styles.messageText, animatedStyle]}>
//         {message[nextWord]} {/* Display the current word */}
//       </Animated.Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, // Take up the full screen
//     justifyContent: 'center', // Center vertically
//     alignItems: 'center', // Center horizontally
//     backgroundColor: 'black', // Optional: improves visibility for white text
//   },
//   messageText: {
//     color: '#fb02d9',
//     textAlign: 'center',
//     fontSize: 30, // Base font size used for dynamic scaling
//     fontWeight: 'bold',
//   },
// });
