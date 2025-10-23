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
import TeleconsultationPatientScreen from "./src/screens/patient/TeleconsultationPatientScreen.js";
import TeleconsultationProScreen from "./src/screens/pro/TeleconsultationProScreen.js";
import MessagingScreen from "./src/screens/MessagingScreen.js";
import EcgScreen from "./src/screens/patient/EcgScreen.js";
import ProfilePatientScreen from "./src/screens/patient/ProfilePatientScreen.js";
import ProfileProScreen from "./src/screens/pro/ProfileProScreen.js";
import EditProfileScreen from "./src/screens/EditProfileScreen.js";
import JitsiWebViewScreen from "./src/screens/JitsiWebViewScreen.js";
import PatientsList from "./src/screens/pro/PatientsList.js";


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
        <Stack.Screen name="TeleconsultationPatientScreen" component={TeleconsultationPatientScreen} />
        <Stack.Screen name="TeleconsultationProScreen" component={TeleconsultationProScreen} />
        <Stack.Screen name="MessagingScreen" component={MessagingScreen} />
        <Stack.Screen name="EcgScreen" component={EcgScreen} />
        <Stack.Screen name="ProfilePatientScreen" component={ProfilePatientScreen} />
        <Stack.Screen name="ProfileProScreen" component={ProfileProScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="JitsiWebViewScreen" component={JitsiWebViewScreen} />
        <Stack.Screen name="PatientsList" component={PatientsList} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// Register the app entry point for Expo
registerRootComponent(App);
