import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { TransactionProvider } from './src/contexts/TransactionContext';


export default function App() {
  return (
    <TransactionProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TransactionProvider>
  );
}
