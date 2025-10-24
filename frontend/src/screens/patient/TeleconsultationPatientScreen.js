/**
 * Teleconsultation Patient Screen
 * ----------------------------------------------------
 * React Native screen allowing a patient to access their teleconsultation session.
 * Designed to work with `expo-web-browser`, similar to the professional side.
 *
 * Responsibilities:
 * - Periodically fetch the teleconsultation details linked to a given appointment
 * - Open the Jitsi video consultation in the mobile browser
 * - Display relevant appointment and doctor information
 *
 * Notes:
 * - The teleconsultation link is refreshed every 10 seconds until available.
 * - Uses a temporary appointment ID for testing purposes.
 * - Automatically redirects the patient back to the home screen after closing the browser.
 */

import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderPage from "../../components/HeaderPage";
import FooterPatient from "../../components/FooterPatient";
import Button from "../../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getTeleconsultationByAppointment } from "../../services/api";
import * as WebBrowser from "expo-web-browser";

export default function TeleconsultationPatientScreen() {
  const navigation = useNavigation();
  const [teleconsultation, setTeleconsultation] = useState(null);

  // Temporary appointment ID used for testing
  const appointmentId = "5596d1d6-fb02-457f-9726-3b3db9e6abee";

  // Periodically fetches teleconsultation data from the API
  const fetchTeleconsultation = async () => {
    try {
      const data = await getTeleconsultationByAppointment(appointmentId);
      setTeleconsultation(data);
    } catch (error) {
      console.log("En attente de la création de la salle...");
    } finally {
      setIsLoading(false);
    }
  };

  // Runs once at mount, then refreshes data every 10 seconds
  useEffect(() => {
    fetchTeleconsultation();
    const interval = setInterval(fetchTeleconsultation, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  // Opens the Jitsi consultation in the browser using expo-web-browser
  const handleJoinConsultation = async () => {
    const jitsiLink = teleconsultation?.jitsiLink || "https://meet.jit.si/test-visio-demo";

    Alert.alert(
      "Rejoindre la consultation",
      "Vous allez être redirigé vers la visioconférence.",
      [
        {
          text: "Ouvrir",
          onPress: async () => {
            try {
              // Opens the browser with the teleconsultation link
              const result = await WebBrowser.openBrowserAsync(teleconsultation.jitsiLink, {
                presentationStyle: "pageSheet", // iOS appearance style
                controlsColor: "#042456",       // iOS toolbar color
                toolbarColor: "#fff",        // Android toolbar color
              });

              // When the user closes the browser → navigate back to the home screen
              if (result.type === "dismiss") {
                navigation.navigate("HomePatientScreen");
              }
            } catch (error) {
              console.error("Erreur d'ouverture du navigateur :", error);
              Alert.alert("Erreur", "Impossible d’ouvrir la visioconférence.");
            }
          },
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Téléconsultations" />

      <View style={styles.scrollArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Date section */}
            <View style={styles.rowCenter}>
              <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
              <Text style={styles.title}>16/10/2025 - 14h00</Text>
            </View>

            {/* Doctor section */}
            <View style={styles.rowCenter}>
              <FontAwesome6 name="user-doctor" size={22} color="#042456" style={styles.iconInline} />
              <Text style={styles.text}>Dr. DUPONT</Text>
            </View>

            {/* Button */}
            <Button
              title="Rejoindre la consultation"
              onPress={handleJoinConsultation}
              variant="full"
            />
          </View>
        </ScrollView>
      </View>

      <FooterPatient />
    </SafeAreaView>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#042456",
  },
  scrollArea: {
    flex: 1,
    marginTop: 70,
    marginBottom: 80,
  },
  scrollContainer: {
    paddingHorizontal: 12,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 7,
    padding: 10,
    position: "relative",
  },
  iconInline: {
    marginRight: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    color: "#042456",
  },
  text: {
    fontSize: 16,
    color: "#042456",
    fontWeight: "500",
  },
});
