/**
 * DocumentScreen
 * ------------------------------------------------------
 * Placeholder screen for the future document management feature.
 * This screen serves as a visual marker and defines the structural
 * layout for upcoming functionalities related to document uploads,
 * viewing, and sharing.
 *
 * Features:
 * - Static placeholder with clear layout
 * - Uses the reusable `HeaderPage` component for consistency
 * - Prepares the base structure for future enhancements
 *
 * Future Enhancements:
 * - Upload and preview of medical documents
 * - Secure storage and encryption
 * - Sharing and downloading capabilities
 * - Filtering and categorization of files
 */
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import HeaderPage from "../../components/HeaderPage";

/**
 * DocumentScreen Component
 * ------------------------------------------------------
 * Displays a placeholder layout for the future document
 * management area within the pro interface.
 */

export default function DocumentScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Document" />

      {/* --- Main content area --- */}
      <View style={styles.content}>
        <Text style={styles.title}>Espace Document</Text>
        <Text style={styles.text}>
          Futur document à implémenter.
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
  // Centers the placeholder content vertically and horizontally
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Title displayed prominently at the top of the screen
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#042456",
    marginBottom: 10,
  },
  // Informational text displayed under the title
  text: {
    fontSize: 16,
    color: "#042456",
  },
});
