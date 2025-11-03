/**
 * AddPatientScreen
 * ----------------------------------------------------
 * A React Native screen that allows a healthcare professional to
 * search for a patient and associate them with their account.
 *
 * Features:
 * - Patient search by name or first name
 * - Displays search results dynamically
 * - Allows association of patients with the logged-in professional
 * - Uses the API services `searchAllPatients` and `addPatient`
 * - Includes reusable components: Header, Footer, Button, Separator
 *
 * UX Design:
 * - Scrollable layout with consistent CardioHub UI
 * - Input validation and feedback for empty searches
 * - Clear visual hierarchy for results and actions
 */

import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addPatient, searchAllPatients } from "../../services/api";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from '../../components/FooterPro';
import Button from '../../components/Button';
import Separator from "../../components/Separator";

/**
 * AddPatientScreen Component
 * ----------------------------------------------------
 * Handles patient search and association for healthcare professionals.
 *
 * @param {object} navigation - React Navigation prop for screen navigation.
 * @returns {JSX.Element} The screen component for searching and linking patients.
 */

export default function AddPatientScreen({navigation}) {
  const [searchTerm, setSearchTerm] = useState("");       // Name or first name input by the user
  const [foundPatients, setFoundPatients] = useState([]); // List of search results
  const [hasSearched, setHasSearched] = useState(false);  // Indicates if a search was made
  const [isLoading, setIsLoading] = useState(false);      // Loading indicator for API calls

  /**
   * Handles the search action for patients.
   * - Validates input (non-empty field)
   * - Calls the backend via `searchAllPatients()`
   * - Normalizes and stores results
   */
  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    if (!searchTerm.trim()) {
      return Alert.alert("Erreur", "Veuillez entrer un nom ou un prénom");
    }

    try {
      const data = await searchAllPatients(searchTerm.trim());

      // Normalizes response and ensures consistent naming fields
      const patients = Array.isArray(data)
        ? data.map((p) => ({
          id: p.id,
          firstname: p.firstname || p.firstName,
          lastname: p.lastname || p.lastName,
          email: p.email,
          alreadyLinked: p.alreadyLinked, // Indicates if patient is already linked to the pro
        }))
        : [];

      setFoundPatients(patients);
    } catch (err) {
      console.log("Erreur lors de la recherche :", err);
      setFoundPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Associates a patient with the logged-in professional.
   * - Calls `addPatient(patientId)`
   * - Displays confirmation message
   * - Removes patient from list once associated
   */
  const handleAdd = async (patientId) => {
    try {
      await addPatient(patientId);
      Alert.alert("Patient associé avec succès !");
      setFoundPatients((prev) => prev.filter((p) => p.id !== patientId));
    } catch (err) {
      console.error("Erreur ajout patient :", err);
      Alert.alert("Erreur", err.message || "Impossible d'ajouter le patient");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Ajout de patient" />

      {/* --- Scrollable content area --- */}
      <ScrollView style={{flex: 1}} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* --- Search input and button --- */}
        <View>
          <TextInput
            style={styles.input}
            placeholder="Recherche de patient"
            placeholderTextColor="#042456"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {/* --- Search button --- */}
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={{color: "#042456", fontWeight: "bold", fontSize: 17}}>Rechercher</Text>
          </TouchableOpacity>
        </View>

        <Separator />

        {/* --- Search results section --- */}
        <View style={{ marginTop: -20 }}>
          <View style={{ marginTop: 20 }}>
            {foundPatients.length ? (
              foundPatients.map((patient) => (
                <View key={patient.id} style={styles.patientCard}>
                  <Text style={styles.patientName}>{patient.firstname} {patient.lastname}</Text>
                  
                  <Text style={styles.text}>
                    <Text style={styles.bold}>Email : </Text>
                    {patient.email}
                  </Text>

                  {/* --- Button to associate a patient with the professional --- */}
                  <Button
                    variant= 'full'
                    title={patient.alreadyLinked ? "Déjà associé" : "Associer au pro"}
                    disabled={patient.alreadyLinked}
                    onPress={() => handleAdd(patient.id)}
                  />
                </View>
              ))
            ) : ( !isLoading && hasSearched && (
              <Text style={{ marginTop: 10, color: "#fff", textAlign: "center", fontSize: 18 }}>Aucun patient trouvé</Text>
            ))}
          </View>
        </View>
      </ScrollView>

      <FooterPro />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Main container with blue background
  container: {
    flex: 1,
    backgroundColor: "#042456",
    paddingTop: 70,
  },
  // Scroll area for dynamic content
  scrollArea: {
    flex: 1,
  },
  // Inner padding for ScrollView content
  scrollContainer: {
    paddingHorizontal: 12,
    marginBottom: 80,
  },
  // Text input for search queries
  input: {
    borderWidth: 1,
    backgroundColor: "#fff",
    height: 40,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: "#042456",
  },
  // Search button styling
  button: {
    backgroundColor: "#F5F7FA",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  // Patient result card layout
  patientCard: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  // Patient name displayed prominently
  patientName: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 5,
    color: "#042456",
  },
  // General text inside the patient card
  text: {
    color: "#042456",
    fontSize: 16,
  },
  // Bold subtext for field labels
  bold: {
    fontWeight: "600",
  },
});
