import React from 'react';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import Main from '../screens/Main';

const AppLoader = () => {
  const [loaded] = useFonts({
    // Kablammo: require('../../assets/fonts/Kablammo-regular.ttf'),
    // AnotherFont: require('./path/to/AnotherFont.ttf'),
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return <Main />;
};

export default AppLoader;
