/**
 * TeleconsultationProScreen
 * ------------------------------------------------------
 * Main interface for healthcare professionals to manage teleconsultations.
 *
 * Features:
 * - Displays upcoming appointments retrieved from the backend API
 * - Allows filtering by time period (today, week, or all)
 * - Provides patient search functionality
 * - Starts a teleconsultation session (Jitsi integration)
 * - Redirects to a note-taking screen after session ends
 * - Enables creation and modification of appointments
 *
 * Technical details:
 * - Uses `AppState` to detect when the browser closes and return to the app
 * - Leverages `useFocusEffect` to refresh data when screen regains focus
 * - Integrates multiple reusable components (Button, HeaderPage, FooterPro)
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, AppState } from "react-native";
import HeaderPage from "../../components/HeaderPage.js";
import FooterPro from "../../components/FooterPro";
import Button from "../../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ActivityIndicator } from "react-native";
import { getAppointmentPro, createTeleconsultation } from "../../services/api";
import calculateAge from "../../utils/CalculateAge.js";
import * as WebBrowser from "expo-web-browser";

/**
 * TeleconsultationProScreen Component
 * ------------------------------------------------------
 * Displays all upcoming teleconsultations and allows launching sessions.
 */

export default function TeleconsultationProScreen({ navigation }) {
  // --- Local States ---
  const [appointments, setAppointments] = useState([]); // All appointments
  const [searchText, setSearchText] = useState(""); // Patient name filter
  const [selectedFilter, setSelectedFilter] = useState("Aujourd'hui"); // Active filter
  const [loading, setLoading] = useState(true); // Data loading indicator
  const [isLoading, setIsLoading] = useState(false); // API call loading state
  const appState = useRef(AppState.currentState); // App state reference
  const currentAppointmentRef = useRef(null); // Currently active teleconsultation

  // --- Manage App State (when browser closes) ---
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current !== "active" && nextState === "active") {
        if (currentAppointmentRef.current) {
          navigation.navigate("NoteScreen", { appointment: currentAppointmentRef.current });
          currentAppointmentRef.current = null;
        }
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [navigation]);


  /**
   * Handles starting a teleconsultation session.
   * ------------------------------------------------------
   * - Calls the backend API to create a new teleconsultation
   * - Opens the Jitsi video room via the in-app browser
   * - Redirects to the note-taking screen when closed
   */
  const handleStartConsultation = async (appointment) => {
    try {
      currentAppointmentRef.current = appointment;
      setIsLoading(true);
      //  Create a teleconsultation via the backend API
      const teleconsultation = await createTeleconsultation(appointment.id);

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
              // When the user closes the browser, return to the professional home screen
              if (result.type === "dismiss" || result.type === 'cancel') {
                navigation.navigate("NoteScreen" , { appointment });
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
  
  /**
   * Loads all appointments each time the screen gains focus.
   */
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchAppointment = async () => {
        try {
          setLoading(true);
          const response = await getAppointmentPro();
          if (isActive) {
            // We handle returns in both direct array and object format.
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
        isActive = false; // Prevents an update if the component is unmounted
      };
    }, [])
  );

  /**
  * Converts a date in the French format "dd/mm/yyyy hh:mm:ss"
  * into a usable JavaScript Date object (ISO format). 
  */
  const parseFrenchDate = (dateStr) => {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  };


  /**
   * Filters appointments:
   * - Removes past appointments
   * - Applies active filter (Today / Week / All)
   * - Applies patient name search
   * - Sorts results chronologically
   */
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = parseFrenchDate(appointment.dateTime);

    // Day boundaries
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // Week boundaries
    const startOfWeek = new Date(todayStart);
    startOfWeek.setDate(todayStart.getDate() - todayStart.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Excludes past appointments
    if (appointmentDate < todayStart) return false;

    // Filtering according to the active filter
    if (selectedFilter === "Aujourd'hui") {
      return appointmentDate >= todayStart && appointmentDate <= todayEnd;
    }
    if (selectedFilter === "Semaine") {
      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    }
    return true;
  })
  // Next, filter by searching for first or last name.
    .filter((appointment) => {
      if (!searchText) return true;
      const fullName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase();
      return fullName.includes(searchText.toLowerCase());
    })
  // Sort in chronological order
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Téléconsultations" />

      {/* === MAIN CONTENT === */}
      <KeyboardAvoidingView style={{flex: 1, backgroundColor: "#042456", paddingTop: 50, zIndex: -1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        

        {/* --- Fixed Section: New Appointment --- */}
        <View style={styles.fixedAction}>
          <Button
            title="Nouveau rendez-vous"
            onPress={() => navigation.navigate('AppointmentScreen')}
            variant="full"
            icon="calendar-plus"
          />
        </View>

        {/* --- Scrollable Content --- */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Filter Buttons */}
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

          {/* Appointments Display */}
          {loading ? (
            <ActivityIndicator size="large" color="#042456" />
          ) : filteredAppointments.length === 0 ? (
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>Aucun rendez-vous à afficher</Text>
          ) : (
            filteredAppointments.map((appointment) => {
              const [datePart, timePart] = appointment.dateTime.split(' ');
              const [hour, minute] = timePart ? timePart.split(':') : ['', ''];
              const formattedTime = `${hour}:${minute}`;
                
              return (
                <View key={appointment.id} style={styles.card}>
                  <View style={styles.rowCenter}>
                    <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
                    <Text style={styles.title}>{datePart} à {formattedTime}</Text>
                  </View>
                  <View style={styles.rowCenter}>
                    <MaterialIcons name="account-circle" size={45} color="#042456" style={styles.iconInline} />
                    <View>
                      <Text style={styles.patientName}>{appointment.patient.firstName} {appointment.patient.lastName}</Text>
                      <Text style={styles.patientAge}>{calculateAge(appointment.patient.birthDate)} ans</Text>
                    </View>
                  </View>
                  <View style={styles.buttonRow}>
                    <Button
                      title={isLoading ? "Création en cours..." : "Lancer la consultation"}
                      onPress={() => handleStartConsultation(appointment)}
                      variant="full"
                      disabled={isLoading}
                    />

                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => navigation.navigate('EditAppointmentScreen', {appointment})}
                    >
                      <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* --- Search Bar --- */}
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
      </KeyboardAvoidingView>


      <FooterPro />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /** FIXED SECTION: New Appointment Button **/
  fixedAction: {
    backgroundColor: "#F5F7FA",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  /** FILTER BAR **/
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
    backgroundColor: "#E6E6E6", // inactive
    borderRadius: 10,
  },
  filterItemActive: {
    backgroundColor: "#fff", // white when active
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
  /** SCROLL CONTENT **/
  scrollContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  rowCenter: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 5,
  },
  iconInline: {
    marginRight: 8,
  },
  /** APPOINTMENT CARD **/
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 10,
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#042456",
  },
  patientName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#042456",
    marginBottom: 2,
  },
  patientAge: {
    fontSize: 16,
    color: "#042456",
  },
  /** SEARCH BAR **/
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
    marginBottom: 70,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#042456",
  },
  /** BUTTONS **/
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#042456',
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginBottom: -10
  },
  editButtonText: {
    color: '#042456',
    fontSize: 15,
    fontWeight: '600',
  },
});
