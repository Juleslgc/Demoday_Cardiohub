import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

/**
 * Generic Header component used across internal app screens.
 *
 * Features:
 * - Displays a back arrow button to navigate to the previous screen.
 * - Displays a title passed as a prop.
 *
 * Example usage:
 * <HeaderPage title="Teleconsultations" />
 *
 * @param {string} title - The text displayed as the screen title.
 */

export default function HeaderPage({ title }) {
  // Access the navigation object from React Navigation
  const navigation = useNavigation();

  return (
  // SafeAreaView ensures the header is correctly positioned on devices with notches or status bars
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={26} color="#042456" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Main container that aligns with the device's safe area
  safeArea: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "#fff",
  },
  // Header layout container
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 50,
    paddingHorizontal: 10,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "relative",
  },
  // Back button positioned on the left
  backButton: {
    position: "absolute",
    left: 10,
    zIndex: 2,
  },
  // Center area that holds the title
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  // Header title text styling
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#042456",
  },
});
