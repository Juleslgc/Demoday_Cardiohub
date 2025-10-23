import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchPatientsByName, addPatient, searchAllPatients } from "../../services/api";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from '../../components/FooterPro';
import Button from '../../components/Button';

export default function AddPatientScreen({navigation}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundPatients, setFoundPatients] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return Alert.alert("Erreur", "Veuillez entrer un nom ou un prénom");
    }

    try {
      const data = await searchAllPatients(searchTerm.trim());
      console.log("🔍 Résultat API :", data);

      // Normalisation et calcul alreadyLinked pour le pro connecté
      const patients = Array.isArray(data)
        ? data.map((p) => ({
            id: p.id,
            firstname: p.firstname || p.firstName,
            lastname: p.lastname || p.lastName,
            email: p.email,
            alreadyLinked: p.alreadyLinked,
          }))
        : [];

      if (patients.length === 0) {
        Alert.alert("Aucun patient trouvé");
      }
      console.log("Résultat patient :", patients)

      setFoundPatients(patients);
    } catch (err) {
      console.error("Erreur recherche :", err);
      Alert.alert("Erreur", err.message || "Impossible de rechercher les patients");
    }
  };

  const handleAdd = async (patientId) => {
    try {
      await addPatient(patientId);
      Alert.alert("Succès", "Patient associé avec succès !");
      setFoundPatients((prev) => prev.filter((p) => p.id !== patientId));
    } catch (err) {
      console.error("Erreur ajout patient :", err);
      Alert.alert("Erreur", err.message || "Impossible d'ajouter le patient");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Ajout de patient" />
      <ScrollView style={{flex: 1}} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Recherche de patient"
            placeholderTextColor="#042456"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={{color: "#042456", fontWeight: "bold"}}>Rechercher</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={{ marginTop: 20 }}>
            {foundPatients.length > 0 ? (
              foundPatients.map((patient) => (
                <View key={patient.id} style={styles.patientCard}>
                  <Text style={styles.text}>{patient.firstname} {patient.lastname}</Text>
                  <Text style={styles.text}>Email : {patient.email}</Text>
                  <Button
                    variant= 'full'
                    title={patient.alreadyLinked ? "Déjà associé" : "Associer au pro"}
                    disabled={patient.alreadyLinked}
                    onPress={() => handleAdd(patient.id)}
                  />
                </View>
              ))
            ) : (
              <Text style={{ marginTop: 10, color: "#fff", textAlign: "center" }}>Aucun patient trouvé</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <FooterPro />
    </SafeAreaView>
  );
}

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
    marginBottom: 80,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: "#042456"
  },
  button: {
    backgroundColor: "#fff",
    height: 30,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  text: {
    color: "#042456",
  }
});
