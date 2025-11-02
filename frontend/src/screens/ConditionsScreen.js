/**
 * ConditionsScreen
 * ------------------------------------------------------
 * Screen that displays the application's Terms and Conditions.
 * This screen provides users with legal information and usage guidelines.
 *
 * Features:
 * - Custom header with back arrow and CardioHub logo
 * - Scrollable content area for long text blocks
 * - Safe area support for devices with notches (iOS/Android)
 *
 * Future Enhancements:
 * - Load legal text dynamically from an external source (CMS or API)
 * - Add hyperlinks to Privacy Policy or related documents
 * - Improve readability with sections and bullet formatting
 */

import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * ConditionsScreen Component
 * ------------------------------------------------------
 * Renders the Terms and Conditions page with a header and scrollable text content.
 */

export default function ConditionsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header section with back button and logo --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#042456" />
        </TouchableOpacity>
        <Image
          source={require("../assets/LogoCardioHub.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* --- Scrollable legal text section --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Conditions d'utilisation</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula
          purus ac augue tristique, sit amet cursus lorem faucibus. Donec vel
          dolor sed lorem dictum sagittis. Phasellus finibus, lacus eget
          elementum mattis, lorem nisi convallis lectus, non feugiat magna ex
          nec metus. Aliquam sit amet velit in sem sollicitudin porttitor.
          Curabitur sit amet odio nec justo placerat aliquet sit amet a nisl.
          {"\n\n"}
          Suspendisse potenti. Donec ac orci cursus, viverra ex eu, interdum
          ipsum. Nunc elementum urna in tellus porta, nec tincidunt nunc
          porttitor. Vivamus congue eros in eros sodales, vitae bibendum odio
          gravida. Donec ut tortor eget justo sagittis luctus.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with white background
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Header containing the back button and logo
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  // Adds tap area for the back arrow
  backButton: {
    padding: 5,
  },
  // Logo centered in the header area
  logo: {
    width: 150,
    height: 50,
    alignSelf: "center",
    flex: 1,
  },
  // Container for scrollable text
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // Page title centered at the top
  title: {
    fontSize: 22,
    color: "#042456",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  // Main legal text with justified alignment
  text: {
    color: "#042456",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
});
