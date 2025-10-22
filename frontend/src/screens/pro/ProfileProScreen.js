/**
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
import HeaderPro from "../../components/HeaderPro";
import FooterPro from "../../components/FooterPro";
import { getMePro } from "../../services/api";
import Button from "../../components/Button";
import Separator from "../../components/Separator";
import LogOut from "../../utils/LogOut";

// Functional component representing the patient profile page
export default function ProfileProScreen({ navigation }) {
  // Holds the current user data retrieved from the API
  const [user, setUser] = useState(null);

  // Fetch user data 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMePro(); // API call to fetch logged-in user's profile
        setUser(data); // Store the retrieved user in state
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };
    fetchUser();
  }, []);

  // Redirects to the login screen (logout simulation)
  const handleLogout = () => {
    LogOut(navigation);
  };

  // Redirects to the Edit Profile screen
  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPro />

      <View style={styles.scrollArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Mon profil</Text>
          {/* Conditional rendering: display user info once loaded */}
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
          {/* Button to navigate to profile editing screen */}
          <Button
            title="Modifier mes informations"
            onPress={handleEditProfile}
            variant="full"
            icon="account-edit"
          />
          <Separator />
          {/* Bouton to log out (redirecting to login screen) */}
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

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA", // Light background for readability
  },
  scrollArea: {
    flex: 1,
    marginTop: 70,      // header height (50) + margin of 20
    marginBottom: 80,   // footer height (60) + margin of 20
  },
  content: {
    paddingBottom: 80,      // Offset for footer height
    paddingHorizontal: 20,  // Horizontal inner spacing
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#042456",
    textAlign: "center",
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
  },
  label: {
    color: "#888",
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#042456",
    fontWeight: "500",
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },
});
