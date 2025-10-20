/**
 * A placeholder screen for the future in-app messaging feature.
 *
 * Current state:
 * - Displays static placeholder text indicating that
 *   the messaging functionality is not yet implemented.
 *
 * Future enhancements:
 * - Implement secure patient-doctor messaging
 * - Fetch and display message threads from the API
 * - Allow sending and receiving messages in real-time
 * - Include read indicators, timestamps, and attachments
 */

import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import HeaderPage from "../components/HeaderPage";

// Functional component representing the patient messaging space
export default function MessagingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Messagerie" />

      <View style={styles.content}>
        <Text style={styles.title}>Espace Messagerie</Text>
        <Text style={styles.text}>
          Future messagerie à implémenter.
        </Text>
      </View>

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
