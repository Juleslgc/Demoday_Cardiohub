import { registerRootComponent } from 'expo';
import React from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SimulationPsc from './src/screens/SimulationPsc.js';
import LoginScreen from './src/screens/LoginScreen.js';
import HomePro from './src/screens/HomeProScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
  <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Connexion" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SimulationPsc" component={SimulationPsc} options={{ headerShown: false }} />
        <Stack.Screen name="HomePro" component={HomePro} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
  );
}
registerRootComponent(App);