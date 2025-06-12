// AppNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EditScreen from '../screens/EditScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Início'}} />
      <Stack.Screen name="Add" component={AddTransactionScreen} options={{title: 'Adicionar Transação'}}/>
      <Stack.Screen name="Edit" component={EditScreen} options={{ title: 'Editar Transação' }} />
    </Stack.Navigator>
  );
}
