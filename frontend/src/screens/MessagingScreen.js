/**
 * MessagingScreen
 * ------------------------------------------------------
 * Placeholder screen for the upcoming in-app messaging feature.
 * This screen currently displays a static message but will later
 * support secure communication between patients and professionals.
 *
 * Features:
 * - Static placeholder layout for future messaging system
 * - Integration with `HeaderPage` for consistent navigation
 * - Simple visual layout ready for chat UI implementation
 *
 * Future Enhancements:
 * - Real-time messaging between patient and healthcare professional
 * - Integration with backend API for message storage
 * - Support for attachments, read receipts, and timestamps
 * - Push notifications for new messages
 */

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import HeaderPage from "../components/HeaderPage";

/**
 * MessagingScreen Component
 * ------------------------------------------------------
 * Displays a placeholder for the future messaging area
 * within the patient and pro interface.
 */

export default function MessagingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Messagerie" />

      {/* --- Main content area --- */}
      <View style={styles.content}>
        <Text style={styles.title}>Espace Messagerie</Text>
        <Text style={styles.text}>
          Future messagerie à implémenter.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with light background color for readability
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  // Centers the placeholder content both vertically and horizontally
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Title text styled for emphasis
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#042456",
    marginBottom: 10,
  },
  // Placeholder descriptive text
  text: {
    fontSize: 16,
    color: "#042456",
  },
});
