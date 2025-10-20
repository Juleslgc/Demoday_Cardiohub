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
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderPage from "../components/HeaderPage";
import FooterPatient from "../components/FooterPatient";

// Functional component representing the profile edit page
export default function EditProfileScreen() {
  return (
  <SafeAreaView style={styles.container}>
        <HeaderPage title="Modifications profil" />
  
        <View style={styles.content}>
          <Text style={styles.title}>Modifications du profil</Text>
          <Text style={styles.text}>
            Formulaire à implémenter.
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
