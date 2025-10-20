/**
 * A placeholder screen dedicated to the teleconsultation feature.
 *
 * Current state:
 * - Displays static placeholder text to indicate where
 *   video consultation functionality will be implemented.
 *
 * Future enhancements:
 * - Integrate real-time video conferencing (via Jitsi)
 * - Display upcoming teleconsultation details
 * - Allow joining a scheduled session directly from this screen
 * - Handle call permissions (camera, microphone) and connection states
 */

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Linking } from "react-native";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from "../../components/FooterPro";
import Button from "../../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createTeleconsultation } from "../../services/api";

// Functional component representing the teleconsultation area
export default function TeleconsultationProScreen({ navigation }) {
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartConsultation = async (appointmentId) => {
    try {
      setIsLoading(true);
  
      // Étape 1 : le pro crée la téléconsultation
      const teleconsultation = await createTeleconsultation(appointmentId);
      console.log("Téléconsultation créée :", teleconsultation);
  
      if (!teleconsultation?.jitsiLink) {
        Alert.alert("Erreur", "Aucun lien Jitsi disponible.");
        return;
      }
  
      // Étape 2 : extraire le nom de salle
      const roomName = teleconsultation.jitsiLink.split("https://meet.jit.si/")[1];
  
      // Étape 3 : ouverture de la salle
      // 👉 pour le pro, on ouvre dans le navigateur (pour être reconnu comme hôte)
      const fullUrl = `https://meet.jit.si/${roomName}`;
  
      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        Alert.alert(
          "Ouverture de la salle",
          "Vous allez être redirigé vers votre navigateur pour lancer la consultation.",
          [
            {
              text: "Ouvrir",
              onPress: () => Linking.openURL(fullUrl),
            },
            { text: "Annuler", style: "cancel" },
          ]
        );
      } else {
        Alert.alert("Erreur", "Impossible d’ouvrir le lien Jitsi.");
      }
  
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

      {/* === Section fixe : Nouveau rendez-vous === */}
      <View style={styles.fixedAction}>
        <Button
          title="Nouveau rendez-vous"
          // onPress={...}
          variant="full"
          icon="calendar-plus"
        />
      </View>

        {/* === Contenu défilant === */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >

          {/* === Barre de filtres === */}
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterItem, selectedFilter === "Tous" && styles.filterItemActive,]}
              onPress={() => setSelectedFilter("Tous")}
            >
              <Text style={[styles.filterText, selectedFilter === "Tous" && styles.filterTextActive,]}>
                Tous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterItem, selectedFilter === "Aujourd'hui" && styles.filterItemActive,]}
              onPress={() => setSelectedFilter("Aujourd'hui")}
            >
              <Text style={[styles.filterText, selectedFilter === "Aujourd'hui" && styles.filterTextActive,]}>
                Aujourd'hui
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterItem, selectedFilter === "Semaine" && styles.filterItemActive,]}
              onPress={() => setSelectedFilter("Semaine")}
            >
              <Text style={[styles.filterText, selectedFilter === "Semaine" && styles.filterTextActive,]}>
                Semaine
              </Text>
            </TouchableOpacity>
          </View>

          {/* Exemple de carte de téléconsultation */}
          <View style={styles.card}>
            {/* Date section */}
            <View style={styles.rowCenter}>
              <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
              <Text style={styles.title}>16/10/2025 - 14h00</Text>
            </View>

            {/* Patient section */}
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
        
        {/* === BARRE DE RECHERCHE === */}
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

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#042456",
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

  /** BARRE DE FILTRES **/
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
    backgroundColor: "#E6E6E6", // inactif
    borderRadius: 10,
  },
  filterItemActive: {
    backgroundColor: "#fff", // blanc quand actif
  },
  filterText: {
    fontSize: 18,
    color: "#042456",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#042456",
    fontWeight: "600",
  },

  /** CONTENU SCROLLABLE **/
  scrollContainer: {
    padding: 12,
    paddingBottom: 100, // pour ne pas cacher le bas sous le footer
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,   // Vertical space between cards
    borderRadius: 7,
    padding: 10,
    position: "relative", // Allows icon positioning
  },
  iconInline: {
    marginRight: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    color: "#042456",
  },
  patientName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#042456",
    marginBottom: 2, // petit espace entre nom et âge
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
