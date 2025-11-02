/**
 * ProfilePatientScreen
 * ---------------------------------------
 * A React Native screen that displays the patient's personal profile information.
 *
 * Features:
 * - Fetches and displays user data from the API (`getMe` service)
 * - Provides navigation to edit profile information
 * - Includes a logout button that redirects to the login screen
 * - Integrates reusable Header and Footer components
 * - Uses a scrollable layout for better UX on smaller screens
 */

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import HeaderPatient from "../../components/HeaderPatient";
import FooterPatient from "../../components/FooterPatient";
import { getMe } from "../../services/api";
import Button from "../../components/Button";
import Separator from "../../components/Separator";
import LogOut from "../../utils/LogOut";

/**
 * ProfilePatientScreen Component
 * ---------------------------------------
 * Displays and manages the patient's profile data.
 * Allows editing profile information and logging out.
 *
 * @param {object} navigation - React Navigation prop used for screen navigation.
 * @returns {JSX.Element} The rendered profile screen for the logged-in patient.
 */

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null); // Stores the fetched user data

  // --- Fetch user data on mount ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe(); // Retrieve the logged-in user's profile
        setUser(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };
    fetchUser();
  }, []);

  // --- Navigation handlers ---
  const handleLogout = () => {
    LogOut(navigation);
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPatient />

      {/* --- Main content area --- */}
      <View style={styles.scrollArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Mon profil</Text>

          {/* Display user information once fetched */}
          {user ? (
            <View style={styles.infoBox}>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>{user.lastName}</Text>
        
              <Text style={styles.label}>Prénom</Text>
              <Text style={styles.value}>{user.firstName}</Text>
              <Text style={styles.label}>Date de naissance</Text>
              <Text style={styles.value}>
                {new Date(user.birthDate).toLocaleDateString("fr-FR")}
              </Text>

              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>

              <Text style={styles.label}>Téléphone</Text>
              <Text style={styles.value}>{user.phone || "Non renseigné"}</Text>

              <Text style={styles.label}>Adresse</Text>
              <Text style={styles.value}>{user.address || "Non renseignée"}</Text>
            </View>
          ) : (
            <Text style={styles.loading}>Chargement du profil...</Text>
          )}
          
          {/* --- Edit profile button --- */}
          <Button
            title="Modifier mes informations"
            onPress={handleEditProfile}
            variant="full"
            icon="account-edit"
          />
          <Separator />

          {/* --- Logout button --- */}
          <Button
            title="Se déconnecter"
            onPress={handleLogout}
            variant="full"
            icon="logout"
          />
        </ScrollView>
      </View>

      <FooterPatient />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with light background
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  // Scrollable area adjusted for header and footer height
  scrollArea: {
    flex: 1,
    marginTop: 70,
    marginBottom: 80,
  },
  // ScrollView inner padding
  content: {
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  // Page title styling
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#042456",
    textAlign: "center",
    marginBottom: 20,
  },
  // User info container
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
  },
  // Info field label
  label: {
    color: "#888",
    fontSize: 14,
    marginTop: 10,
  },
  // Info field value
  value: {
    fontSize: 16,
    color: "#042456",
    fontWeight: "500",
  },
  // Loading message
  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },
});
