/**
 * ConditionsScreen Component
 * ---------------------------------------
 * This screen displays the application's Terms and Conditions.
 * It includes a custom header with a back button and a scrollable text section.
 *
 * Navigation:
 * - React Navigation prop used to navigate back to the previous screen.
 *
 * Features:
 * - Safe area view for proper display on devices with notches.
 * - Custom header with logo and back arrow icon.
 * - Scrollable content area for long legal text.
 */

import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

// Functional component rendering the Terms and Conditions screen
export default function ConditionsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Custom header with back button and logo */}
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

// Define component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",  // Align back button and logo horizontally
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,  // Adds tappable area around the back icon
  },
  logo: {
    width: 150,
    height: 50,
    alignSelf: "center",
    flex: 1,  // Allows the logo to take available space between elements
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    color: "#042456",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  text: {
    color: "#042456",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
});
