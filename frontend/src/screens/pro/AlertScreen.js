/**
 * AlertScreen
 * ------------------------------------------------------
 * Temporary screen serving as a placeholder for the future
 * management of alert messages (emergencies, notifications, etc.).
 *
 * Features:
 * - Displays a static placeholder message
 * - Uses the reusable `HeaderPage` component
 * - Serves as a future entry point for alert management UI
 *
 * Future Enhancements:
 * - Display alerts received from connected patients
 * - Integrate push notifications or urgent messages
 * - Provide filtering, acknowledgment, and status tracking
 */

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import HeaderPage from "../../components/HeaderPage";

/**
 * AlertScreen Component
 * ------------------------------------------------------
 * Displays a placeholder area for the future alert management feature.
 */

export default function AlertScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Alerte" />

      {/* --- Main content area --- */}
      <View style={styles.content}>
        <Text style={styles.title}>Espace Alerte</Text>
        <Text style={styles.text}>
          Futur message d'alerte à implémenter.
        </Text>
      </View>

    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with light background for clarity
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  // Centers main content both vertically and horizontally
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Large bold title for the page heading
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#042456",
    marginBottom: 10,
  },
  // Supporting text displayed under the title
  text: {
    fontSize: 16,
    color: "#042456",
  },
});
