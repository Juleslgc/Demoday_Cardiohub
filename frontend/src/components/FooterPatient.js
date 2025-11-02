import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * FooterPatient Component
 * ---------------------------------------
 * A reusable React Native component that provides a bottom navigation
 * bar designed for the patient interface of the application.
 *
 * Features:
 * - Safe area handling for devices with home indicators (iOS/Android)
 * - Five navigation buttons: Home, Video Consultation, ECG, Messages, and Profile
 * - Each button includes an icon and label for clear navigation
 * - Persistent fixed position at the bottom of the screen
 *
 * Example usage:
 * <FooterPatient />
 */

export default function FooterPatient() {
  const navigation = useNavigation(); // Hook for navigating between patient screens

  return (
    // SafeAreaView ensures the footer doesn't overlap system UI areas
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}> 
      <View style={styles.footer}>

        {/* Home navigation button */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("HomePatientScreen")}
        >
          <Entypo name="home" size={22} color="#042456" />
          <Text style={styles.link}>Accueil</Text>
        </TouchableOpacity>

        {/* Video consultation navigation button */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("TeleconsultationPatientScreen")}
        >
          <FontAwesome5 name="video" size={22} color="#042456" />
          <Text style={styles.link}>Téléconsulte</Text>
        </TouchableOpacity>

        {/* ECG feature navigation button */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("EcgScreen")}
        >
          <FontAwesome name="heartbeat" size={24} color="#F35330" />
          <Text style={styles.link}>ECG</Text>
        </TouchableOpacity>

        {/* Messaging navigation button */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("MessagingScreen")}
        >
          <FontAwesome name="envelope" size={22} color="#042456" />
          <Text style={styles.link}>Messagerie</Text>
        </TouchableOpacity>

        {/* Profile navigation button */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("ProfilePatientScreen")}
        >
          <FontAwesome name="user" size={22} color="#042456" />
          <Text style={styles.link}>Profil</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container that sticks to the bottom of the screen
  safeArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  // Main footer container layout
  footer: {
    height: 60,       
    flexDirection: "row",       
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    zIndex: 1,
  },
  // Reusable style for each navigation button
  navButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  // Label text for navigation items
  link: {
    color: "#042456",
    fontSize: 15,
    marginTop: 2, 
    fontFamily: "Nunito",
    fontWeight: "500",
  },
});
