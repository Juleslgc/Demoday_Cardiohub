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
import PatientRegisterScreen from "./src/screens/patient/PatientRegisterScreen.js";
import LoginScreen from "./src/screens/LoginScreen.js";
import ConditionsScreen from "./src/screens/ConditionsScreen.js";
import ConfidentialiteScreen from "./src/screens/ConfidentialiteScreen.js";
import SimulationPsc from './src/screens/pro/SimulationPsc.js';
import HomeProScreen from './src/screens/pro/HomeProScreen.js';
import HomePatientScreen from './src/screens/patient/HomePatientScreen.js';
import TeleconsultationScreen from "./src/screens/patient/TeleconsultationScreen.js";
import MessagingScreen from "./src/screens/MessagingScreen.js";
import EcgScreen from "./src/screens/patient/EcgScreen.js";
import ProfileScreen from "./src/screens/patient/ProfilPatientScreen.js";
import EditProfileScreen from "./src/screens/EditProfileScreen.js";
import ProfileProScreen from "./src/screens/pro/ProfilProScreen.js";
import TeleconsultationProScreen from "./src/screens/pro/TeleconsultationProScreen.js";
import AppointmentScreen from "./src/screens/pro/AppointmentScreen.js";
import CalendarScreen from "./src/screens/pro/CalendarScreen.js";

// Create the navigation stack
const Stack = createNativeStackNavigator();

// Main application component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
       
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// Register the app entry point for Expo
registerRootComponent(App);
