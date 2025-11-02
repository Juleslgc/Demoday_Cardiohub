import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import HeaderPage from "../../components/HeaderPage";

/**
 * ECG Screen Component
 * ---------------------------------------
 * This screen serves as a placeholder for the future ECG (Electrocardiogram) feature.
 * 
 * Purpose:
 * - Represents the section dedicated to connecting and visualizing ECG data.
 * - Currently acts as a placeholder while the ECG connection logic is being developed.
 *
 * Current State:
 * - Displays a title and informational text indicating the feature is not yet implemented.
 *
 * Future Enhancements:
 * - Connect to the patient’s ECG device (Bluetooth or external API).
 * - Display real-time ECG signal visualization.
 * - Provide access to historical ECG data.
 * - Enable secure data sharing with medical professionals.
 * - Manage connection state, errors, and signal quality.
 */

export default function EcgScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header section */}
      <HeaderPage title="Capteur ECG" />

      {/* Main content area */}
      <View style={styles.content}>
        <Text style={styles.title}>Espace ECG</Text>
        <Text style={styles.text}>
          Connexion ECG à implémenter.
        </Text>
      </View>

    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with light background
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  // Main content centered both vertically and horizontally
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Page title displayed prominently
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#042456",
    marginBottom: 10,
  },
  // Supporting text below the title
  text: {
    fontSize: 16,
    color: "#042456",
  },
});
