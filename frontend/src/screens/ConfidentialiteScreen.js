/**
 * ConfidentialiteScreen Component
 * ---------------------------------------
 * This screen displays the application's Privacy Policy.
 * It features a custom header with a back button and logo,
 * along with a scrollable text area for legal content.
 *
 * Navigation:
 * - React Navigation prop used to return to the previous screen.
 *
 * Features:
 * - SafeAreaView for proper display on devices with notches.
 * - Custom header with logo and back icon.
 * - Scrollable layout for long policy text.
 */

import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

// Functional component displaying the Privacy Policy screen
export default function ConfidentialiteScreen({ navigation }) {
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

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  logo: {
    width: 150,
    height: 50,
    alignSelf: "center",
    flex: 1,
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
