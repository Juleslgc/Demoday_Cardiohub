/**
 * App Entry Point (App.js)
 * ------------------------------------------------------
 * Central configuration file for the CardioHub mobile application.
 *
 * Responsibilities:
 * - Initializes and registers the React Navigation container.
 * - Defines all available screens using a native stack navigator.
 * - Manages navigation flow between Patient and Professional sections.
 * - Disables default headers (`headerShown: false`) to use custom ones.
 * - Sets `HomeScreen` as the default entry point.
 *
 * Technical details:
 * - Uses `@react-navigation/native` for navigation management
 * - Uses `createNativeStackNavigator` for performance and native-like transitions
 * - Registered with Expo via `registerRootComponent(App)`
 */

import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// ------------------------------------------------------
// Screen Imports
// ------------------------------------------------------
// Core navigation
import HomeScreen from "./src/screens/HomeScreen.js";
import LoginScreen from "./src/screens/LoginScreen.js";
import PatientRegisterScreen from "./src/screens/patient/PatientRegisterScreen.js";
import SimulationPsc from "./src/screens/pro/SimulationPsc.js";

// Legal & Info
import ConditionsScreen from "./src/screens/ConditionsScreen.js";
import ConfidentialiteScreen from "./src/screens/ConfidentialiteScreen.js";

// Patient screens
import HomePatientScreen from "./src/screens/patient/HomePatientScreen.js";
import TeleconsultationPatientScreen from "./src/screens/patient/TeleconsultationPatientScreen.js";
import ProfilePatientScreen from "./src/screens/patient/ProfilePatientScreen.js";
import EcgScreen from "./src/screens/patient/EcgScreen.js";

// Professional screens
import HomeProScreen from "./src/screens/pro/HomeProScreen.js";
import TeleconsultationProScreen from "./src/screens/pro/TeleconsultationProScreen.js";
import AppointmentScreen from "./src/screens/pro/AppointmentScreen.js";
import EditAppointmentScreen from "./src/screens/pro/EditAppointmentScreen.js";
import CalendarScreen from "./src/screens/pro/CalendarScreen.js";
import AddPatientScreen from "./src/screens/pro/AddPatientScreen.js";
import PatientList from "./src/screens/pro/PatientsList.js";
import ProfileProScreen from "./src/screens/pro/ProfileProScreen.js";
import AlertScreen from "./src/screens/pro/AlertScreen.js";
import DocumentScreen from "./src/screens/pro/DocumentScreen.js";
import NoteScreen from "./src/screens/pro/NoteScreen.js";
import PatientFileScreen from "./src/screens/pro/PatientFileScreen.js";

// Shared / general screens
import MessagingScreen from "./src/screens/MessagingScreen.js";
import EditProfileScreen from "./src/screens/EditProfileScreen.js";

// ------------------------------------------------------
// Stack Navigator Setup
// ------------------------------------------------------
const Stack = createNativeStackNavigator();

/**
 * Main Application Component
 * ------------------------------------------------------
 * Wraps the entire app within a NavigationContainer and
 * defines the navigation stack hierarchy.
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        {/* === CORE NAVIGATION === */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PatientRegisterScreen" component={PatientRegisterScreen} />
        <Stack.Screen name="SimulationPsc" component={SimulationPsc} />

        {/* === LEGAL === */}
        <Stack.Screen name="ConditionsScreen" component={ConditionsScreen} />
        <Stack.Screen name="ConfidentialiteScreen" component={ConfidentialiteScreen} />

        {/* === PATIENT FLOW === */}
        <Stack.Screen name="HomePatientScreen" component={HomePatientScreen} />
        <Stack.Screen name="TeleconsultationPatientScreen" component={TeleconsultationPatientScreen} />
        <Stack.Screen name="ProfilePatientScreen" component={ProfilePatientScreen} />
        <Stack.Screen name="EcgScreen" component={EcgScreen} />

        {/* === PRO FLOW === */}
        <Stack.Screen name="HomeProScreen" component={HomeProScreen} />
        <Stack.Screen name="TeleconsultationProScreen" component={TeleconsultationProScreen} />
        <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
        <Stack.Screen name="EditAppointmentScreen" component={EditAppointmentScreen} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen name="AddPatientScreen" component={AddPatientScreen} />
        <Stack.Screen name="PatientList" component={PatientList} />
        <Stack.Screen name="ProfileProScreen" component={ProfileProScreen} />
        <Stack.Screen name="AlertScreen" component={AlertScreen} />
        <Stack.Screen name="DocumentScreen" component={DocumentScreen} />
        <Stack.Screen name="NoteScreen" component={NoteScreen} />
        <Stack.Screen name="PatientFileScreen" component={PatientFileScreen} />

        {/* === SHARED === */}
        <Stack.Screen name="MessagingScreen" component={MessagingScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ------------------------------------------------------
// Expo Entry Point Registration
// ------------------------------------------------------
registerRootComponent(App);
