import React, { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import FooterPro from "../../components/FooterPro";
import Button from "../../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ActivityIndicator } from "react-native";
import { getAppointmentPro } from "../../services/api";
import calculateAge from "../../utils/CalculateAge.js";

// Functional component representing the teleconsultation area
export default function TeleconsultationProScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]); // liste de tous les rdv
  const [searchText, setSearchText] = useState(""); // texte tapé dans la recherche
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Aujourd'hui");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchAppointment = async () => {
        try {
          setLoading(true);
          const response = await getAppointmentPro();
          if (isActive) {
            setAppointments(Array.isArray(response) ? response : response.appointments || []);
          }
        } catch (err) {
          console.error("Erreur lors du chargement des rendez-vous :", err);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchAppointment();

      return () => {
        isActive = false; // évite les updates après démontage
      };
    }, [])
  );

  // Convertir la date au format ISO
  const parseFrenchDate = (dateStr) => {
    // Exemple : "18/10/2025 14:00:00"
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  };


  // Filtrage dynamique
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = parseFrenchDate(appointment.dateTime);

    // bornes du jour
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // bornes de la semaine
    const startOfWeek = new Date(todayStart);
    startOfWeek.setDate(todayStart.getDate() - todayStart.getDay()); // dimanche
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // samedi
    endOfWeek.setHours(23, 59, 59, 999);

    // Supprime les rendez-vous passés
    if (appointmentDate < todayStart) return false;

    // Filtrage selon le filtre actif
    if (selectedFilter === "Aujourd'hui") {
      return appointmentDate >= todayStart && appointmentDate <= todayEnd;
    }
    if (selectedFilter === "Semaine") {
      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    }

    // “Tous” -> on garde tout ce qui n’est pas passé
    return true;
  })
  // Ensuite, filtrage par recherche (nom)
  .filter((appointment) => {
    if (!searchText) return true;
    const fullName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  })
  // Et enfin, tri par ordre chronologique
  .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));





  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1, backgroundColor: "#042456"}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* === Header personnalisé === */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={26} color="#042456" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Téléconsultations</Text>
          </View>
        </View>
        {/* === Section fixe : Nouveau rendez-vous === */}
        <View style={styles.fixedAction}>
          <Button
            title="Nouveau rendez-vous"
            onPress={() => navigation.navigate('AppointmentScreen')}
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
              {["Aujourd'hui", "Semaine", "Tous"].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterItem, selectedFilter === filter && styles.filterItemActive]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
            {/* If the data is loading, a spinner is displayed */}
            {loading ? (
              <ActivityIndicator size="large" color="#042456" />
            ) : filteredAppointments.length === 0 ? (
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>Aucun rendez-vous à afficher</Text>
            ) : (
              filteredAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.card}>
                    <View style={styles.rowCenter}>
                      <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
                      <Text style={styles.title}>{appointment.dateTime}</Text>
                    </View>
                    <View style={styles.rowCenter}>
                      <MaterialIcons name="account-circle" size={45} color="#042456" style={styles.iconInline} />
                      <View>
                        <Text style={styles.patientName}>{appointment.patient.firstName} {appointment.patient.lastName}</Text>
                        <Text style={styles.patientAge}>{calculateAge(appointment.patient.birthDate)} ans</Text>
                      </View>
                    </View>
                    <Button
                      title="Lancer la consultation"
                      //onPress={onPress}
                      variant="full"
                    />
                </View>
              ))
            )}
          </ScrollView>
          {/* === BARRE DE RECHERCHE === */}
          <View style={styles.searchSection}>
            <FontAwesome name="search" size={20} color="#042456" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un patient..."
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        <FooterPro />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  /** HEADER **/
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 10,
    zIndex: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#042456",
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
  },
  /** BARRE DE FILTRES **/
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#E6E6E6", // gris clair de fond
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