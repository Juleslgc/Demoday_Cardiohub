/**
 * HomeScreen Component
 * ---------------------------------------
 * Main entry point of the CardioHub application.
 * This screen allows users to choose between creating
 * a Patient or Professional account, or logging in.
 *
 * Navigation:
 * - React Navigation prop used to navigate between screens.
 *
 * Features:
 * - Displays the app logo and welcome message.
 * - Provides navigation to registration and login screens.
 * - Includes reusable UI components for consistency.
 */

import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Button from "../components/Button";
import Separator from "../components/Separator";
import SeparatorWithText from "../components/SeparatorWithText";

// Functional component rendering the Home screen
export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.logoContainer}>
        <Image
          source={require("../assets/LogoCardioHub.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>


      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue sur CardioHub</Text>
        
        <Button
          title="Créer un compte Patient"
          onPress={() => navigation.navigate("PatientRegisterScreen")}
          variant="full"
        />

        <SeparatorWithText/>

        <Button
          title="Créer un compte Professionnel"
          onPress={() => navigation.navigate("ProRegisterScreen")}
          variant="full"
        />

        <View style={styles.proConnectContainer}>
          <MaterialCommunityIcons name="shield-check" size={20} color="#042456" />
          <Text style={styles.text}>via Pro Santé Connect</Text>
        </View>
        
        <Separator />

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

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 290,
    height: 130,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    width: "80%",
    marginTop: -100,
  },
  title: {
    color: '#042456',
    fontSize: 20,
    marginBottom: 40,
    fontWeight: "normal",
    textAlign: "center"
  },
  text: {
    color: '#042456',
    fontSize: 16,
    textAlign: "center"
  },
  proConnectContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 15,
    gap: 6,
  },
});
