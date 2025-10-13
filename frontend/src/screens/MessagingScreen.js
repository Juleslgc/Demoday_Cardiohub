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

import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Functional component representing the patient messaging space
export default function MessagingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espace Messagerie</Text>
      <Text style={styles.text}>
        Future messagerie à implémenter.
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
