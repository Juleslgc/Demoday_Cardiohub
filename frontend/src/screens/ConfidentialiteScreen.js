/**
 * ConfidentialiteScreen
 * ------------------------------------------------------
 * Screen that displays the application's Privacy Policy.
 * Provides users with information on data handling and protection.
 *
 * Features:
 * - Custom header with back button and CardioHub logo
 * - Scrollable area for long text content
 * - Safe area support for devices with notches (iOS/Android)
 *
 * Future Enhancements:
 * - Fetch policy text dynamically from backend or CMS
 * - Add versioning and last-updated date for compliance
 * - Include links to external GDPR and CNIL resources
 */

import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * ConfidentialiteScreen Component
 * ------------------------------------------------------
 * Renders the Privacy Policy screen with a custom header
 * and scrollable text area for legal information.
 */

export default function ConfidentialiteScreen({ navigation }) {
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

      {/* --- Scrollable content area for privacy policy text --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Politique de confidentialité</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
          Donec pharetra tincidunt augue, at viverra elit tincidunt ut. Integer
          cursus leo non odio interdum, at interdum mauris aliquet. Sed bibendum
          ante vel mauris commodo, ut gravida velit fringilla. Curabitur ac
          sollicitudin odio. In dignissim orci a nibh consequat bibendum.
          {"\n\n"}
          Aenean gravida, nunc nec euismod cursus, erat est elementum sapien, non
          dictum nisl lectus sed eros. Donec quis erat ac lectus volutpat
          efficitur. Ut at felis vel leo euismod tincidunt sit amet ut erat.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with white background for readability
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Header section with horizontal layout for back button and logo
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  // Adds padding around the back button for better touch area
  backButton: {
    padding: 5,
  },
  // Logo centered within the header
  logo: {
    width: 150,
    height: 50,
    alignSelf: "center",
    flex: 1,
  },
  // Scrollable area containing the privacy policy text
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // Title displayed prominently at the top of the screen
  title: {
    fontSize: 22,
    color: "#042456",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  // Main privacy text styled for readability and justification
  text: {
    color: "#042456",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
});
