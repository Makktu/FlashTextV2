import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import COLORS from '../values/COLORS';
import MyButton from '../components/MyButton';

export default function Options({ historyOn, historyToggled }) {
  const changeTheme = () => {
    console.log('change theme pressed');
  };
  const changeHistory = () => {
    historyOn = !historyOn;
  };
  return (
    <View style={styles.container}>
      <View style={styles.themeContainer}>
        <Text style={styles.text}>Theme Selection</Text>
        <Text style={styles.lesserText}>Current Theme: Shocking Pink</Text>
        <MyButton whenPressed={changeTheme}>Change</MyButton>
      </View>
      <View style={styles.historyContainer}>
        <Text style={styles.text}>History Options</Text>
        <Text style={styles.lesserText}>
          Current Choice: History {historyOn ? 'ON' : 'OFF'}
        </Text>
        <MyButton whenPressed={changeHistory}>
          {historyOn ? 'Turn OFF' : 'Turn ON'}
        </MyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.alt2Secondary,
  },
  title: {},
  text: {
    fontSize: 44,
    color: 'white',
  },
  lesserText: {
    fontSize: 24,
    color: 'white',
  },
});
