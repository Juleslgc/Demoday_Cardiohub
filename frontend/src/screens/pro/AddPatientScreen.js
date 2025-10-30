import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addPatient, searchAllPatients } from "../../services/api";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from '../../components/FooterPro';
import Button from '../../components/Button';
import Separator from "../../components/Separator";

/**
* Screen: Add Patient
* ----------------------------------------------------
* Allows a healthcare professional to:
* - search for a patient in the database
* - view the results
* - associate a patient with their account
*/
export default function AddPatientScreen({navigation}) {
  // States managing the search
  const [searchTerm, setSearchTerm] = useState(""); // Last name or first name to search for
  const [foundPatients, setFoundPatients] = useState([]); // Search results
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
  * Searches for patients via the API
  * - Checks that the field is not empty
  * - Calls `searchAllPatients()`
  * - Updates the list of results
  */
  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    if (!searchTerm.trim()) {
      return Alert.alert("Erreur", "Veuillez entrer un nom ou un prénom");
    }

    try {
      const data = await searchAllPatients(searchTerm.trim());

      // Normalization and calculation of alreadyLinked for the connected pro
      const patients = Array.isArray(data)
        ? data.map((p) => ({
            id: p.id,
            firstname: p.firstname || p.firstName,
            lastname: p.lastname || p.lastName,
            email: p.email,
            alreadyLinked: p.alreadyLinked, // boolean indicating whether the patient is already associated
          }))
        : [];

      setFoundPatients(patients);
    } catch (err) {
      //Alert.alert("Erreur", err.message || "Impossible de rechercher les patients");
      setFoundPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
  * Associates a patient with the logged-in professional.
  * - Calls `addPatient(patientId)`
  * - Removes the patient from the list after adding them.
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
      {/* === HEADER === */}
      <HeaderPage title="Ajout de patient" />
      {/* === SCROLLING CONTENT === */}
      <ScrollView style={{flex: 1}} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* --- Search field --- */}
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

        {/* --- List of results --- */}
        <View style={{ marginTop: -20 }}>
          <View style={{ marginTop: 20 }}>
          {foundPatients.length ? (
              foundPatients.map((patient) => (
                <View key={patient.id} style={styles.patientCard}>
                  <Text style={styles.patientName}>{patient.firstname} {patient.lastname}</Text>
                  <Text style={styles.text}>Email : {patient.email}</Text>
                  {/* Association button */}
                  <Button
                    variant= 'full'
                    title={patient.alreadyLinked ? "Déjà associé" : "Associer au pro"}
                    disabled={patient.alreadyLinked}
                    onPress={() => handleAdd(patient.id)}
                  />
                </View>
              ))
            ) : ( hasSearched && (
              <Text style={{ marginTop: 10, color: "#fff", textAlign: "center", fontSize: 18 }}>Aucun patient trouvé</Text>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* === FOOTER === */}
      <FooterPro />
    </SafeAreaView>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#042456",
    paddingTop: 70
  },
  scrollArea: {
    flex: 1
  },
  scrollContainer: {
    paddingHorizontal: 12, // Inner horizontal padding for content alignment
    marginBottom: 80, // space for the footer
  },
  input: {
    borderWidth: 1,
    backgroundColor: "#fff",
    height: 40,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: "#042456"
  },
  button: {
    backgroundColor: "#F5F7FA",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  patientCard: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
    color: "#042456",
  },
  text: {
    color: "#042456",
    fontSize: 16
  }
});
