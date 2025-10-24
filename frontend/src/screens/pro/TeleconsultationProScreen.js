/**
 * Teleconsultation Screen (Professional)
 * ----------------------------------------------------
 * React Native screen allowing healthcare professionals to start teleconsultations.
 * Handles video session launching via Jitsi Meet using the integrated Expo Web Browser.
 *
 * Responsibilities:
 * - Create a teleconsultation session linked to an appointment
 * - Open the Jitsi link securely in an in-app browser
 * - Display scheduled appointments and filter them by date
 *
 * Notes:
 * - Uses `expo-web-browser` to open the video conference directly from the app.
 * - Automatically navigates back to the professional home screen when the browser closes.
 * - Includes a mock appointment example for testing purposes.
 */

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from "../../components/FooterPro";
import Button from "../../components/Button";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createTeleconsultation } from "../../services/api";
import * as WebBrowser from "expo-web-browser";

export default function TeleconsultationProScreen({ navigation }) {
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);

  // Handles the teleconsultation start process for a given appointment
  const handleStartConsultation = async (appointmentId) => {
    try {
      setIsLoading(true);

      //  Create a teleconsultation via the backend API
      const teleconsultation = await createTeleconsultation(appointmentId);
      console.log("Téléconsultation créée :", teleconsultation);

      if (!teleconsultation?.jitsiLink) {
        Alert.alert("Erreur", "Aucun lien Jitsi disponible.");
        return;
      }

      // Extract the room name from the returned Jitsi link
      const roomName = teleconsultation.jitsiLink.split("https://meet.jit.si/")[1];
      
      // Rebuild the full Jitsi URL (in case of format issues)
      const fullUrl = `https://meet.jit.si/${roomName}`;

      // Open the teleconsultation session in the integrated browser
      Alert.alert(
        "Ouverture de la salle",
        "Vous allez être redirigé vers la visioconférence.",
        [
          {
            text: "Ouvrir",
            onPress: async () => {
              const result = await WebBrowser.openBrowserAsync(fullUrl, {
                presentationStyle: "pageSheet", // iOS style
                controlsColor: "#042456",       // iOS toolbar color
                toolbarColor: "#fff",        // Android toolbar color
              });

              // When the user closes the browser → return to the professional home screen
              if (result.type === "dismiss") {
                navigation.navigate("HomeProScreen");
              }
            },
          },
          { text: "Annuler", style: "cancel" },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la création de la téléconsultation :", error);
      Alert.alert("Erreur", error.message || "Impossible de lancer la téléconsultation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Téléconsultations" />

      <View style={styles.fixedAction}>
        <Button title="Nouveau rendez-vous" variant="full" icon="calendar-plus" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Filter bar for viewing consultations (All / Today / Week) */}
        <View style={styles.filterContainer}>
          {["Tous", "Aujourd'hui", "Semaine"].map((label) => (
            <TouchableOpacity
              key={label}
              style={[styles.filterItem, selectedFilter === label && styles.filterItemActive]}
              onPress={() => setSelectedFilter(label)}
            >
              <Text
                style={[styles.filterText, selectedFilter === label && styles.filterTextActive]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/*  Example teleconsultation card */}
        <View style={styles.card}>
          <View style={styles.rowCenter}>
            <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
            <Text style={styles.title}>16/10/2025 - 14h00</Text>
          </View>

          <View style={styles.rowCenter}>
            <MaterialIcons name="account-circle" size={45} color="#042456" style={styles.iconInline} />
            <View>
              <Text style={styles.patientName}>Julie MARTIN</Text>
              <Text style={styles.patientAge}>30 ans</Text>
            </View>
          </View>

          <Button
            title={isLoading ? "Création en cours..." : "Lancer la consultation"}
            onPress={() => handleStartConsultation("5596d1d6-fb02-457f-9726-3b3db9e6abee")}
            variant="full"
            disabled={isLoading}
          />
        </View>
      </ScrollView>

      <View style={styles.searchSection}>
        <FontAwesome name="search" size={20} color="#042456" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un patient..."
          placeholderTextColor="#666"
          value={searchPatient}
          onChangeText={setSearchPatient}
        />
      </View>

      <FooterPro />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#042456" },
  fixedAction: {
    backgroundColor: "#F5F7FA",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 50,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 18,
  },
  filterItem: {
    flex: 1,
    paddingVertical: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
  },
  filterItemActive: { backgroundColor: "#fff" },
  filterText: { fontSize: 18, color: "#042456", fontWeight: "500" },
  filterTextActive: { color: "#042456", fontWeight: "600" },
  scrollContainer: { padding: 12, paddingBottom: 100 },
  rowCenter: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 7,
    padding: 10,
    position: "relative",
  },
  iconInline: { marginRight: 8 },
  title: { fontSize: 19, fontWeight: "600", color: "#042456" },
  patientName: { fontSize: 17, fontWeight: "600", color: "#042456", marginBottom: 2 },
  patientAge: { fontSize: 16, color: "#042456" },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 80,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#042456" },
});
