/**
 * EditProfileScreen
 * ------------------------------------------------------
 * A placeholder screen for editing patient profile information.
 *
 * Current state:
 * - Displays a simple placeholder message indicating where
 *   the profile editing form will be implemented.
 *
 * Future Enhancements:
 * - Implement a full editable form to modify user details
 *   (e.g., name, email, phone, password, address)
 * - Add client-side validation for required and formatted fields
 * - Integrate API calls to update patient data on the server
 * - Display user feedback after submission (success/error messages)
 * - Possibly include profile photo upload and avatar preview
 * - Add loading and saving states for better UX
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderPage from "../components/HeaderPage";

/**
 * Functional component representing the profile edit page
 * ------------------------------------------------------
 * Serves as a placeholder until the editable profile form
 * and API integration are implemented.
 */

export default function EditProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Modifications profil" />

      {/* === PLACEHOLDER CONTENT === */}
      <View style={styles.content}>
        <Text style={styles.title}>Modifications du profil</Text>
        <Text style={styles.text}>
            Formulaire à implémenter.
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
