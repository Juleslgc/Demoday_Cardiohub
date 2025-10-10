/**
 * Reusable Header Component
 * ---------------------------------------
 * A React Native component that displays a top header
 * with a personalized greeting and the app logo.
 *
 * Features:
 * - Safe area support for devices with notches (iOS/Android)
 * - Fixed positioning at the top of the screen
 * - Horizontal layout with spaced text and image
 * - Simple, clean design for reusability across screens
 */

import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Functional component returning the header layout with text and logo
export default function Header() {
  return (
    // Ensures header content stays below system elements (status bar, notch)
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bonjour Dr. Dupont</Text>
        <Image
          source={require("../assets/LogoCardioHub.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  )
};

// Define styles for the header component
const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",   // Keeps the header fixed at the top
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,                 // Header height
    flexDirection: "row",       // Aligns text and logo horizontally
    alignItems: "center",       // Centers elements vertically
    justifyContent: "space-between", // Pushes text to left, logo to right
    paddingHorizontal: 10,      // Adds space on left and right sides
    zIndex: 100,                // Keeps header above other components
    backgroundColor: "#fff",
    borderBottomWidth: 1,       // Adds subtle bottom border
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "480",          // Medium weight for balanced emphasis
    fontFamily: "Nunito",
    color: "#042456",
    left: 5,                    // Slight left offset for alignment
  },
  logo: {
    width: 140,
    height: 80,
    resizeMode: "contain",      // Ensures correct scaling
  },
});
