import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMePro } from "../services/api";

/**
 * HeaderPro Component
 * ---------------------------------------
 * A reusable React Native component that displays
 * a personalized header for healthcare professionals.
 *
 * Features:
 * - Displays a greeting message with the user's last name
 * - Retrieves professional user data from the API via `getMePro()`
 * - Includes the application logo on the right
 * - Safe area handling for devices with top insets (status bar, notch)
 *
 * Example usage:
 * <HeaderPro />
 */

export default function HeaderPro() {
  const [lastName, setLastName] = useState("");
  
  useEffect(() => {
    /**
       * Fetches user information (last name) from the API when the component mounts.
       */
    const fetchUser = async () => {
      try {
        const user = await getMePro(); // Retrieves { lastName, ... }
        setLastName(user.lastName || ""); // Stores the user's last name
      } catch (error) {
        console.error("Erreur lors de la récupération du nom:", error.message);
      }
    };
    fetchUser();
  }, []);

  return (
    // Ensures header content stays below system UI (status bar, notch)
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>

        {/* Greeting text displaying the professional's last name */}
        <Text style={styles.headerText}>
          Bonjour {lastName ? lastName : "..."}
        </Text>

        {/* App logo displayed on the right */}
        <Image
          source={require("../assets/LogoCardioHub.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  )
};

// Component Styles
const styles = StyleSheet.create({
  // Root container fixed at the top of the screen
  safeArea: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "#fff",
  },
  // Header layout container
  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    zIndex: 100,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  // Greeting text styling
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Nunito",
    color: "#042456",
    left: 5,
  },
  // Logo styling
  logo: {
    width: 140,
    height: 80,
    resizeMode: "contain",
  },
});
