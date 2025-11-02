import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

/**
 * FooterPro Component
 * ---------------------------------------
 * A reusable React Native component that displays a fixed bottom
 * navigation bar for healthcare professionals.
 *
 * Features:
 * - Safe area handling for devices with bottom insets (iOS / Android)
 * - Five navigation buttons: Home, Video Consultation, Patients, Messages, and Profile
 * - Each button includes an icon and a label
 * - Persistent fixed positioning across all professional screens
 *
 * Example usage:
 * <FooterPro />
 */

export default function FooterPro() {
  const navigation = useNavigation();

  return (
    // SafeAreaView ensures compatibility with devices that have bottom insets
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}> 
      <View style={styles.footer}>

        {/* Home navigation button */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("HomeProScreen")}
        >
          <Entypo name="home" size={22} color="#042456" />
          <Text style={styles.link}>Accueil</Text>
        </TouchableOpacity>

        {/* Video consultation navigation button */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("TeleconsultationProScreen")}
        >
          <FontAwesome5 name="video" size={22} color="#042456" />
          <Text style={styles.link}>Téléconsulte</Text>
        </TouchableOpacity>

        {/* Patient list navigation button */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate("PatientList")}
        >
          <FontAwesome6 name="user-group" size={24} color="#b3b1b1" />
          <Text style={styles.link}>Patient</Text>
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
          onPress={() => navigation.navigate("ProfileProScreen")}
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
  // Root container pinned to the bottom of the screen
  safeArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  // Footer container layout
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
  // Label for each navigation item
  link: {
    color: "#042456",
    fontSize: 15,
    marginTop: 2,
    fontFamily: "Nunito",
    fontWeight: "500",
  },
});
