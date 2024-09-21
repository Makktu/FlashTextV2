import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from './src/screens/Main';
import Options from './src/screens/Options';
import COLORS from './src/values/COLORS';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name='FlashText'
          component={Main}
          options={{
            tabBarStyle: {
              // backgroundColor: '#ff0000ff',
              backgroundColor: COLORS.alt1Primary,
            },

            headerStyle: {
              backgroundColor: '#ff0000ff',
              backgroundColor: COLORS.alt1Primary,
            },
            tabBarLabelStyle: {
              fontSize: 24,
              color: 'black',
              fontWeight: 'bold',
            },
          }}
        />
        <Tab.Screen
          name='Options'
          component={Options}
          options={{
            tabBarStyle: {
              // backgroundColor: '#ff0000ff',
              backgroundColor: COLORS.mainPrimary,
            },

            headerStyle: {
              // backgroundColor: '#ff0000ff',
              backgroundColor: COLORS.mainSecondary,
            },
            tabBarLabelStyle: {
              fontSize: 24,
              color: 'black',
              fontWeight: 'bold',
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  text: {
    fontSize: 74,
    color: 'orangered',
  },
  textTwo: {
    fontSize: 18,
    color: '#ff4400d0',
  },
  inputContainer: {
    height: 100,
    width: 800,
    // backgroundColor: '#ff00004e',
  },
  bar: {
    height: 100,
    width: 800,
  },
  button: {
    marginVertical: 18,
    backgroundColor: 'red',
  },
});
