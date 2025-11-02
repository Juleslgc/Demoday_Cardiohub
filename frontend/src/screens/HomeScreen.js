/**
 * HomeScreen
 * ------------------------------------------------------
 * Main entry point of the CardioHub mobile application.
 *
 * Features:
 * - Displays the CardioHub logo and welcome message
 * - Allows users to:
 *   → Create a Patient account
 *   → Create a Professional account (via PSC simulation)
 *   → Log in if already registered
 * - Integrates reusable UI components for visual consistency
 *
 * Technical details:
 * - Uses `SafeAreaView` for compatibility with notched devices
 * - Employs navigation to handle screen transitions
 * - Clean, centered layout for accessibility and clarity
 */

import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Button from "../components/Button";
import Separator from "../components/Separator";
import SeparatorWithText from "../components/SeparatorWithText";

/**
 * HomeScreen Component
 * ------------------------------------------------------
 * Displays the welcome page and guides the user toward
 * registration or authentication.
 */

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* === LOGO SECTION === */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/LogoCardioHub.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* === MAIN CONTENT === */}
      <View style={styles.content}>
        {/* --- Welcome Message --- */}
        <Text style={styles.title}>Bienvenue sur CardioHub</Text>

        {/* --- Patient Account Creation --- */}
        <Button
          title="Créer un compte Patient"
          onPress={() => navigation.navigate("PatientRegisterScreen")}
          variant="full"
        />

        <SeparatorWithText/>

        {/* --- Professional Account Creation --- */}
        <Button
          title="Créer un compte Professionnel"
          onPress={() => navigation.navigate("SimulationPsc")}
          variant="full"
        />

        {/* --- PSC Info Line --- */}
        <View style={styles.proConnectContainer}>
          <MaterialCommunityIcons name="shield-check" size={20} color="#042456" />
          <Text style={styles.text}>via Pro Santé Connect</Text>
        </View>
        
        <Separator />

        {/* --- Login Option --- */}
        <Text style={styles.text}> Déjà inscrit ?</Text>

        <Button
          title="Se connecter"
          onPress={() => navigation.navigate("LoginScreen")}
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // --- Global layout ---
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // --- Logo section ---
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 290,
    height: 130,
  },
  // --- Main content area ---
  content: {
    flex: 1,
    justifyContent: "center",
    width: "80%",
    marginTop: -100,
  },
  // --- Text styles ---
  title: {
    color: '#042456',
    fontSize: 20,
    marginBottom: 40,
    fontWeight: "normal",
    textAlign: "center",
  },
  text: {
    color: '#042456',
    fontSize: 16,
    textAlign: "center",
  },
  // --- Pro Santé Connect visual cue ---
  proConnectContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 15,
    gap: 6,
  },
});
