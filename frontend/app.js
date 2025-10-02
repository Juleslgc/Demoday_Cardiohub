import { registerRootComponent } from 'expo';
import React from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SimulationPsc from './src/screens/SimulationPsc.js';
import LoginScreen from './src/screens/LoginScreen.js';


export default function App() {
  return (
  <SafeAreaProvider>
    <LoginScreen/>
  </SafeAreaProvider>
  );
}
registerRootComponent(App);