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
import AddPatientScreen from "./src/screens/pro/AddPatientScreen.js";
import PatientList from "./src/screens/pro/PatientsList.js";
import EditAppointmentScreen from "./src/screens/pro/EditAppointmentScreen.js";
import MessagingProScreen from "./src/screens/pro/MessagingProScreen.js";
import AlertScreen from "./src/screens/pro/AlertScreen.js";
import DocumentScreen from "./src/screens/pro/DocumentScreen.js";

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
        <Stack.Screen name="MessagingProScreen" component={MessagingProScreen} />
        <Stack.Screen name="EcgScreen" component={EcgScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ProfileProScreen" component={ProfileProScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="TeleconsultationProScreen" component={TeleconsultationProScreen} />
        <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen name="AddPatientScreen" component={AddPatientScreen} />
        <Stack.Screen name="PatientList" component={PatientList} />
        <Stack.Screen name="EditAppointmentScreen" component={EditAppointmentScreen} />
        <Stack.Screen name="AlertScreen" component={AlertScreen} />
        <Stack.Screen name="DocumentScreen" component={DocumentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// Register the app entry point for Expo
registerRootComponent(App);
