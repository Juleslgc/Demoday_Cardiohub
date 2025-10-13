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
import LoginScreen from "./src/screens/LoginScreen.js";
import ConditionsScreen from "./src/screens/ConditionsScreen.js";
import ConfidentialiteScreen from "./src/screens/ConfidentialiteScreen.js";
import SimulationPsc from './src/screens/SimulationPsc.js';
import HomeProScreen from './src/screens/HomeProScreen.js';
import HomePatientScreen from './src/screens/HomePatientScreen.js';
import TeleconsultationScreen from "./src/screens/TeleconsultationScreen.js";
import MessagingScreen from "./src/screens/MessagingScreen.js";
import EcgScreen from "./src/screens/EcgScreen.js";
import ProfilScreen from "./src/screens/ProfilScreen.js";
import EditProfileScreen from "./src/screens/EditProfileScreen.js";

// Create the navigation stack
const Stack = createNativeStackNavigator();

// Main application component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="PatientRegisterScreen" component={PatientRegisterScreen} />
        <Stack.Screen name="SimulationPsc" component={SimulationPsc} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ConditionsScreen" component={ConditionsScreen} />
        <Stack.Screen name="ConfidentialiteScreen" component={ConfidentialiteScreen} />
        <Stack.Screen name="HomeProScreen" component={HomeProScreen} />
        <Stack.Screen name="HomePatientScreen" component={HomePatientScreen} />
        <Stack.Screen name="TeleconsultationScreen" component={TeleconsultationScreen} />
        <Stack.Screen name="MessagingScreen" component={MessagingScreen} />
        <Stack.Screen name="EcgScreen" component={EcgScreen} />
        <Stack.Screen name="ProfilScreen" component={ProfilScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// Register the app entry point for Expo
registerRootComponent(App);
