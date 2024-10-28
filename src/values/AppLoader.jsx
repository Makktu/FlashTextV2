import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import Main from '../screens/Main';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const AppLoader = () => {
  const [loaded] = useFonts({
    Kablammo: require('../../assets/fonts/Kablammo-regular.ttf'),
    Bubblegum: require('../../assets/fonts/Bubblegum-regular.ttf'),
    Caveat: require('../../assets/fonts/Caveat.ttf'),
    Fascinate: require('../../assets/fonts/Fascinate-regular.ttf'),
    Russo: require('../../assets/fonts/Russo-regular.ttf'),
  });

  React.useEffect(() => {
    if (loaded) {
      // Hide the splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // or a loading component if you prefer
  }

  return <Main />;
};

export default AppLoader;
