/**
 * PatientList
 * ------------------------------------------------------
 * This screen displays the complete list of patients
 * for a healthcare professional.
 *
 * Features:
 * - Fetches the list of patients from the backend API.
 * - Allows searching by patient name (live filtering).
 * - Provides navigation to a patient's file.
 * - Includes a fixed button to add a new patient.
 * - Integrates consistent header and footer components.
 *
 * Technical details:
 * - Uses `useFocusEffect` to reload data each time the screen is active.
 * - Implements `KeyboardAvoidingView` for proper keyboard management on iOS.
 * - Responsive design with scrollable list and fixed sections.
 */

import React, { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from "../../components/FooterPro";
import Button from "../../components/Button";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import calculateAge from "../../utils/CalculateAge";
import { getPatients } from "../../services/api";

/**
 * PatientList Component
 * ------------------------------------------------------
 * Displays all registered patients with a search bar and
 * navigation options to add or view detailed patient info.
 */

export default function PatientList({ navigation }) {
  // --- Local States ---
  const [searchPatient, setSearchPatient] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches patient data when the screen is focused.
   */
  useFocusEffect(
    useCallback(() => {
      // Function to retrieve patients from the API
      const fetchPatients = async () => {
        try {
          const response = await getPatients(navigation);
          setPatients(Array.isArray(response) ? response : response.patients || []);
        } catch (error) {
          console.error("Erreur lors du chargement des patients :", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPatients();
    }, []));

  // --- Filtered patients based on search input ---
  const filteredPatients = patients.filter((patient) => {
    if (!searchPatient) return true;
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchPatient.toLowerCase());
  })

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Patients" />

      {/* === MAIN CONTENT === */}
      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>

        {/* --- Fixed section: Add patient button --- */}
        <View style={styles.fixedAction}>
          <Button
            title="Ajouter un patient"
            onPress={() => navigation.navigate('AddPatientScreen')}
            variant="full"
            icon="plus"
          />
        </View>

        {/* --- Scrollable list of patients --- */}
        <View style={styles.scrollArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredPatients.map((patient) => 
              <TouchableOpacity 
                key={patient.id}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("PatientFileScreen", { patient })}
              >
                <View style={styles.cardContent}>
                  <MaterialIcons name="account-circle" size={45} color="#042456" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.patientName}>{patient.firstName} {patient.lastName}</Text>
                    <Text style={styles.patientAge}>{calculateAge(patient.birthDate)} ans</Text>
                  </View>
                  <MaterialCommunityIcons name="greater-than" size={24} color="#042456" />
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* --- Search bar --- */}
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
      </KeyboardAvoidingView>

      <FooterPro />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with global background
  container: {
    flex: 1,
    backgroundColor: "#042456",
  },
  // Scrollable area for the patient list
  scrollArea: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  // Fixed section at the top with "Add patient" button
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
  // Individual patient card
  card: {
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 7,
    padding: 10,
    margin: 10,
  },
  // Layout inside each card
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // Patient name and age container
  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  // Patient name text
  patientName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#042456",
  },
  // Patient age text
  patientAge: {
    fontSize: 16,
    color: "#042456",
  },
  // Search bar section at the bottom
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
  // Search icon styling
  searchIcon: {
    marginRight: 10,
  },
  // Search input styling
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#042456",
  },
});
