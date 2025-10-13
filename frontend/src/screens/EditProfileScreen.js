/**
 * A placeholder screen for editing patient profile information.
 *
 * Current state:
 * - Displays a simple placeholder message indicating where
 *   the profile editing form will be implemented.
 *
 * Future enhancements:
 * - Implement an editable form to modify user details (name, email, phone, etc.)
 * - Add form validation and API integration to update user data
 * - Include navigation feedback (success or error messages)
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Functional component representing the profile edit page
export default function EditProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espace Modifier profil</Text>
      <Text style={styles.text}>
        Formulaire à implémenter.
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
