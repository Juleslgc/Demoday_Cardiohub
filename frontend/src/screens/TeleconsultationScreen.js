/**
 * A placeholder screen dedicated to the teleconsultation feature.
 *
 * Current state:
 * - Displays static placeholder text to indicate where
 *   video consultation functionality will be implemented.
 *
 * Future enhancements:
 * - Integrate real-time video conferencing (via Jitsi)
 * - Display upcoming teleconsultation details
 * - Allow joining a scheduled session directly from this screen
 * - Handle call permissions (camera, microphone) and connection states
 */

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import HeaderPatient from "../components/HeaderPatient";
import FooterPatient from "../components/FooterPatient";

// Functional component representing the teleconsultation area
export default function TeleconsultationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPatient />
    
      <View style={styles.content}>
        <Text style={styles.title}>Espace Téléconsultation</Text>
        <Text style={styles.text}>
          Rejoindre une téléconsultation.
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
