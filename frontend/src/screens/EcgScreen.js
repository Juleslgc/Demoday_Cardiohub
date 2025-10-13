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
import { View, Text, StyleSheet } from "react-native";

// Functional component representing the ECG feature screen
export default function EcgScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espace ECG</Text>
      <Text style={styles.text}>
        Connexion ECG à implémenter.
      </Text>
    </View>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
