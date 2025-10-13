/**
 * Reusable FooterPatient Component
 * ---------------------------------------
 * A React Native component that displays a bottom navigation
 * bar specifically designed for the patient interface.
 *
 * Features:
 * - Safe area support for devices with bottom insets (iOS/Android)
 * - Five navigation buttons: Home, Video Consultation, ECG, Messages, and Profile
 * - Each button includes an icon and a label
 * - Fixed positioning for persistent navigation across patient screens
 */

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Functional component returning the footer navigation bar for patients
export default function Footer() {
  const navigation = useNavigation(); // Hook for navigating between patient screens

  return (
    // Ensures footer stays above the system navigation bar or home indicator
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}> 
      <View style={styles.footer}>
        {/* Home navigation button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate("HomePatientScreen")}
        >
          <Entypo name="home" size={22} color="#042456" />
          <Text style={styles.link}>Accueil</Text>
        </TouchableOpacity>

        {/* Video consultation navigation button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate("TeleconsultationScreen")}
        >
          <FontAwesome5 name="video" size={22} color="#042456" />
          <Text style={styles.link}>Téléconsulte</Text>
        </TouchableOpacity>

        {/* ECG feature navigation button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate("EcgScreen")}
        >
          <FontAwesome name="heartbeat" size={24} color="#F35330" />
          <Text style={styles.link}>ECG</Text>
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
          onPress={() => navigation.navigate("ProfilScreen")}
        >
          <FontAwesome name="user" size={22} color="#042456" />
          <Text style={styles.link}>Profil</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// Define styles for the FooterPatient component
const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",       // Keeps the footer foxed at the bottom
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  footer: {
    height: 60,                 // Footer height
    flexDirection: "row",       // Aligns icons and text horizontally
    alignItems: "center",       // Vertically centers elements
    justifyContent: "space-between", // Evenly spaces navigation buttons
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,          // Adds subtle top border
    borderTopColor: "#ccc",
    zIndex: 1,                  // Ensures footer appears above main content
  },
  homeButton: {
    flexDirection: "column",    // Places icon above text
    alignItems: "center",       // Centers both horizontally
  },
  link: {
    color: "#042456",
    fontSize: 15,
    marginTop: 2,               // Space between icon and label
    fontFamily: "Nunito",
    fontWeight: "480",
  },
});
