/**
 * Reusable HeaderPatient Component
 * ---------------------------------------
 * A React Native component that displays the patient header
 * with a personalized greeting and the app logo.
 *
 * Features:
 * - Safe area support for devices with notches (iOS/Android)
 * - Fixed positioning at the top of the screen
 * - Horizontal layout with spaced greeting text and logo
 * - Clean, minimal design consistent with the app’s theme
 */

import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Functional component returning the patient header layout
export default function Header() {
  return (
    // Ensures header content stays below system UI (status bar, notch)
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bonjour Alice</Text>
        <Image
          source={require("../assets/LogoCardioHub.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  )
};

// Define styles for the HeaderPatient component
const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",   // Keeps the header fixed at the top
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,             // Header height
    flexDirection: "row",   // Aligns elements horizontally
    alignItems: "center",   // Vertically centers text and logo
    justifyContent: "space-between", // Places text left and logo right
    paddingHorizontal: 10,
    zIndex: 100,            // Keeps header above other content
    backgroundColor: "#fff",
    borderBottomWidth: 1,   // Adds subtle bottom border
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "480",
    fontFamily: "Nunito",
    color: "#042456",
    left: 5,                // Slight left offset for alignment
  },
  logo: {
    width: 140,
    height: 80,
    resizeMode: "contain",  // Ensures proper logo scaling
  },
});
