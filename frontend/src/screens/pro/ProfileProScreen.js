/**
 * ProfileProScreen
 * ------------------------------------------------------
 * Displays the professional user’s personal profile information.
 *
 * Features:
 * - Fetches and displays the logged-in professional’s data from the API (`getMePro`)
 * - Provides navigation to edit profile information
 * - Allows the user to log out via the `LogOut` utility
 * - Integrates consistent Header and Footer components
 * - Uses a scrollable layout for smaller screens
 *
 * Technical details:
 * - Uses React hooks (`useState`, `useEffect`) for data fetching and state management
 * - Integrates reusable UI components (Button, Separator)
 * - Fully responsive and aligned with the app’s visual identity
 */

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import HeaderPro from "../../components/HeaderPro";
import FooterPro from "../../components/FooterPro";
import { getMePro } from "../../services/api";
import Button from "../../components/Button";
import Separator from "../../components/Separator";
import LogOut from "../../utils/LogOut";

/**
 * ProfileProScreen Component
 * ------------------------------------------------------
 * Displays the logged-in healthcare professional’s profile
 * and provides options to edit their information or log out.
 */

export default function ProfileProScreen({ navigation }) {
  const [user, setUser] = useState(null); // Current professional’s data

  /**
   * Fetches user profile information from the backend.
   */ 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMePro();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };
    fetchUser();
  }, []);

  /**
   * Logs the user out and redirects to the login screen.
   */
  const handleLogout = () => {
    LogOut(navigation);
  };

  /**
   * Navigates to the profile editing screen.
   */
  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPro />

      {/* === MAIN CONTENT === */}
      <View style={styles.scrollArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Mon profil</Text>

          {/* --- Profile details --- */}
          {user ? (
            <View style={styles.infoBox}>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>{user.lastName}</Text>

              <Text style={styles.label}>Prénom</Text>
              <Text style={styles.value}>{user.firstName}</Text>

              <Text style={styles.label}>Identification National (RPPS)</Text>
              <Text style={styles.value}>{user.rpps}</Text>

              <Text style={styles.label}>Établissement</Text>
              <Text style={styles.value}>{user.institution}</Text>

              <Text style={styles.label}>Rôle</Text>
              <Text style={styles.value}>{user.role}</Text>

              <Text style={styles.label}>Spécialité</Text>
              <Text style={styles.value}>{user.speciality}</Text>
            </View>
          ) : (
            <Text style={styles.loading}>Chargement du profil...</Text>
          )}

          {/* --- Edit Profile Button --- */}
          <Button
            title="Modifier mes informations"
            onPress={handleEditProfile}
            variant="full"
            icon="account-edit"
          />

          <Separator />

          {/* --- Logout Button --- */}
          <Button
            title="Se déconnecter"
            onPress={handleLogout}
            variant="full"
            icon="logout"
          />
        </ScrollView>
      </View>

      <FooterPro />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Main container with consistent background color
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  // Scroll area with proper spacing around header and footer
  scrollArea: {
    flex: 1,
    marginTop: 70,
    marginBottom: 80,
  },
  // Inner scroll content styling
  content: {
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  // Page title
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#042456",
    textAlign: "center",
    marginBottom: 20,
  },
  // Box displaying user info
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
  },
  // Label text for each field
  label: {
    color: "#888",
    fontSize: 14,
    marginTop: 10,
  },
  // Value text for each field
  value: {
    fontSize: 16,
    color: "#042456",
    fontWeight: "500",
  },
  // Loading message while waiting for user data
  loading: {
    color: "#042456",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
