/**
 * A placeholder screen dedicated to the ECG (electrocardiogram) feature.
 *
 * Current state:
 * - Displays a simple placeholder message indicating that
 *   ECG connection and monitoring features are yet to be implemented.
 *
 * Future enhancements:
 * - Connect to the patient's ECG sensor (Bluetooth or external API)
 * - Display real-time ECG data visualization
 * - Allow historical data access and doctor sharing
 * - Include connection status and error handling
 */

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import HeaderPatient from "../components/HeaderPatient";
import FooterPatient from "../components/FooterPatient";

// Functional component representing the ECG feature screen
export default function EcgScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPatient />

      <View style={styles.content}>
        <Text style={styles.title}>Espace ECG</Text>
        <Text style={styles.text}>
          Connexion ECG à implémenter.
        </Text>
      </View>

      <FooterPatient />
    </SafeAreaView>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA", // Light background for readability
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#042456",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#042456",
  },
});
