import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from './src/screens/Main';
import Options from './src/screens/Options';

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
              backgroundColor: '#ff0000ff',
            },

            headerStyle: {
              backgroundColor: '#ff0000ff',
            },
            tabBarLabelStyle: {
              fontSize: 24,
              color: 'black',
              fontWeight: 'bold',
            },
          }}
        />
        <Tab.Screen name='Options' component={Options} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
