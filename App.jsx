import * as React from 'react';
import AppLoader from './src/values/AppLoader';
import Main from './src/screens/Main';

export default function App() {
  return (
    <AppLoader>
      <Main />
    </AppLoader>
  );
}
