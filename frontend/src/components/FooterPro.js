/**
 * Reusable Footer Component
 * ---------------------------------------
 * A React Native component that displays a fixed footer
 * navigation bar at the bottom of the screen.
 *
 * Features:
 * - Safe area support for devices with bottom insets (iOS/Android)
 * - Five navigation buttons (Home, Video, Patients, Messages, Profile)
 * - Each button includes an icon and a label
 * - Fixed positioning for persistent navigation across screens
 */

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Functional component returning the footer navigation bar
export default function FooterPro() {
  const navigation = useNavigation(); // Hook to handle navigation between screens

  return (
    // Ensures the footer stays above bottom insets (e.g., iPhone X safe area)
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}> 
      <View style={styles.footer}>
        {/* Home navigation button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate("HomeProScreen")}
        >
          <Entypo name="home" size={22} color="#042456" />
          <Text style={styles.link}>Accueil</Text>
        </TouchableOpacity>

        {/* Video consultation navigation button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate("TeleconsultationProScreen")}
        >
          <FontAwesome5 name="video" size={22} color="#042456" />
          <Text style={styles.link}>Téléconsulte</Text>
        </TouchableOpacity>

        {/* Patient list navigation button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate("")}
        >
          <FontAwesome6 name="user-group" size={24} color="#b3b1b1" />
          <Text style={styles.link}>Patient</Text>
        </TouchableOpacity>

        {/* Messaging navigation button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate("MessagingScreen")}
        >
          <FontAwesome name="envelope" size={22} color="#042456" />
          <Text style={styles.link}>Messagerie</Text>
        </TouchableOpacity>

        {/* Profile navigation button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate("ProfileProScreen")}
        >
          <FontAwesome name="user" size={22} color="#042456" />
          <Text style={styles.link}>Profil</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// Define styles for the footer component
const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",   // Keeps the footer fixed at the bottom
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  footer: {
    height: 60,                 // Footer height
    flexDirection: "row",       // Aligns icons and labels horizontally
    alignItems: "center",       // Vertically centers elements
    justifyContent: "space-between", // Evenly spaces navigation buttons
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,          // Subtle top border line
    borderTopColor: "#ccc",
    zIndex: 1,                  // Keeps footer visible above main content
  },
  homeButton: {
    flexDirection: "column",    // Places icon above text
    alignItems: "center",
  },
  link: {
    color: "#042456",
    fontSize: 15,
    marginTop: 2,               // Space between icon and label
    fontFamily: "Nunito",
    fontWeight: "480",
  },
});
