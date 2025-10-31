import React, { useState, useEffect, useCallback } from "react";
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

export default function PatientList({ navigation }) {
  const [searchPatient, setSearchPatient] = useState("");
  // Declaration of the "patients" state to store the list of patients
    const [patients, setPatients] = useState([]);
    // Declaration of the "loading" state to know if the data is still loading
    const [loading, setLoading] = useState(true);

   useFocusEffect(
    useCallback(() => {
      // Function to retrieve patients from the API
      const fetchPatients = async () => {
        try {
          const response = await getPatients(navigation); // API call
          // If the response is an array, we use it directly, otherwise we take response.patients
          setPatients(Array.isArray(response) ? response : response.patients || []);
        } catch (error) {
          console.error("Erreur lors du chargement des patients :", error);
        } finally {
          setLoading(false); // Once finished (success or error), we stop loading
        }
      };
  
      fetchPatients(); // We start patient recovery
    }, [])); // The empty array [] means that this action is only done once on loading

    const filteredPatients = patients.filter((patient) => {
      if (!searchPatient) return true;
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      return fullName.includes(searchPatient.toLowerCase());
    })

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Patients" />
      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Section fixe : Ajouter un patient */}
        <View style={styles.fixedAction}>
          <Button
            title="Ajouter un patient"
            onPress={() => navigation.navigate('AddPatientScreen')}
            variant="full"
            icon="plus"
          />
        </View>
        {/* Scrollable main content area */}
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
        {/* Barre de recherche */}
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#042456",
  },
  scrollArea: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  /** SECTION FIXE : bouton “Nouveau rendez-vous” **/
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
  card: {
    backgroundColor: "#fff",
    marginBottom: 10,   // Vertical space between cards
    borderRadius: 7,
    padding: 10,
    margin: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#042456",
  },
  patientAge: {
    fontSize: 16,
    color: "#042456",
  },
  /** BARRE DE RECHERCHE **/
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
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#042456",
  },
});