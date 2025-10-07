/**
 * App Entry Point
 * ---------------------------------------
 * This file initializes navigation for the React Native app.
 * It defines all available screens and handles transitions
 * between them using React Navigation’s native stack navigator.
 *
 * Features:
 * - Centralized navigation setup.
 * - Uses `headerShown: false` to customize headers per screen.
 * - Sets `HomeScreen` as the default entry point.
 */

import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens
import HomeScreen from "./src/screens/HomeScreen.js";
import PatientRegisterScreen from "./src/screens/PatientRegisterScreen.js";
import ProRegisterScreen from "./src/screens/ProRegisterScreen.js";
import LoginScreen from "./src/screens/LoginScreen.js";
import ConditionsScreen from "./src/screens/ConditionsScreen.js";
import ConfidentialiteScreen from "./src/screens/ConfidentialiteScreen.js";

// Create the navigation stack
const Stack = createNativeStackNavigator();

// Main application component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="PatientRegisterScreen" component={PatientRegisterScreen} />
        <Stack.Screen name="ProRegisterScreen" component={ProRegisterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ConditionsScreen" component={ConditionsScreen} />
        <Stack.Screen name="ConfidentialiteScreen" component={ConfidentialiteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// Register the app entry point for Expo
registerRootComponent(App);
