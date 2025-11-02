/**
 * HomePatientScreen
 * ---------------------------------------
 * A React Native screen displaying the patient's home dashboard.
 *
 * Features:
 * - Displays three main sections: Teleconsultation, ECG Sensor, and Messaging.
 * - Each section provides quick access to relevant patient features.
 * - Uses custom reusable components (HeaderPatient, FooterPatient, Button).
 * - Scrollable layout with consistent styling and responsive design.
 *
 * Future Enhancements:
 * - Add a health summary widget with recent data.
 * - Include notifications for upcoming consultations.
 * - Integrate live ECG connection status.
 */

import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import HeaderPatient from "../../components/HeaderPatient.js";
import FooterPatient from "../../components/FooterPatient.js";
import Button from "../../components/Button.js";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAppointmentPatient } from "../../services/api.js";

/**
 * HomePatientScreen Component
 * ---------------------------------------
 * Displays the main dashboard for a logged-in patient.
 * Fetches and shows upcoming teleconsultations, ECG connection status,
 * and a messaging preview section.
 *
 * @param {object} navigation - React Navigation object for screen transitions.
 * @returns {JSX.Element} The rendered patient home screen.
 */

export default function HomePatientScreen({ navigation }) {
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fetches the list of patient appointments when the screen gains focus.
   * Uses `useFocusEffect` to refresh data each time the user returns to the screen.
   */
  useFocusEffect(
    useCallback(() => {
      const fetchAppointment = async () => {
        try {
          setLoading(true);
          const response = await getAppointmentPatient();

          // Ensures consistent data structure from backend response
          const data = Array.isArray(response)
            ? response
            : (response && response.appointment)
            ? response.appointment
            : [];

          setAppointment(data);
        } catch (err) {
          console.error('Erreur lors du chargement du rendez-vous :', err);
        } finally {
          setLoading(false);
        }
      };
      fetchAppointment();
    }, [])
  );

  /**
   * Converts a date in the French format "dd/mm/yyyy hh:mm:ss"
   * into a usable JavaScript Date object (ISO format).
   * @param {string} dateStr - The date string in French format.
   * @returns {Date} A valid JavaScript Date object.
   */
  const parseFrenchDate = (dateStr) => {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  };

  /**
   * Formats a French-style date string for user-friendly display.
   * @param {string} dateStr - The original date string.
   * @returns {string} The formatted date (e.g., "31/10/2025 à 14:30").
   */
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = parseFrenchDate(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  };
  
  /**
   * Filters the upcoming appointments and sorts them chronologically.
   * Displays only the next scheduled teleconsultation.
   */
  const recentAppointment = appointment
    .filter(a => new Date(parseFrenchDate(a.dateTime)) >= new Date()) 
    .sort((a, b) => new Date(parseFrenchDate(a.dateTime)) - new Date(parseFrenchDate(b.dateTime)));

  // --- Navigation Handlers ---
  // Each function redirects the user to the corresponding patient screen.
  const handleTeleconsultation = () => {
    navigation.navigate("TeleconsultationPatientScreen");
  };

  const handleMessaging = () => {
    navigation.navigate("MessagingScreen");
  };

  const handleEcg = () => {
    navigation.navigate("EcgScreen");
  };

  // Mock messages displayed in the messaging preview section
  const messages = [
    { sender: "Dr. DUPONT", subject: "Résultat de votre ECG", time: "09:45" },
    { sender: "Dr. LEROY", subject: "Compte-rendu de consultation", time: "Hier" },
  ];

  return (
  // Ensures proper layout on devices with notches or curved screens
    <SafeAreaView style={styles.container}>
      {/* Top navigation header */}
      <HeaderPatient />

      {/* Scrollable main content */}
      <View style={styles.scrollArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >

          {/* --- Teleconsultation section --- */}
          {loading ? (
            <ActivityIndicator size="large" color="#042456" />
          ) : (
            <>
              {recentAppointment.length > 0 ? (
                <View key={recentAppointment[0].id} style={styles.card}>
                  <FontAwesome5 name="video" size={22} color="#042456" style={styles.icon} />
                  <Text style={styles.title}>Téléconsultation</Text>
                  <Text style={styles.text}>Prochain rendez-vous :</Text>
                  <Text style={styles.dateText}>{formatDateTime(recentAppointment[0].dateTime)}</Text>
                  <Text style={styles.text}>
                    Dr {recentAppointment[0].pro.lastName} - {recentAppointment[0].pro.speciality}
                  </Text>

                  <Button
                    title="Voir mes téléconsultations"
                    onPress={handleTeleconsultation}
                    variant="full"
                  />
                </View>
              ) : (
                // If no upcoming consultation exists
                <View style={styles.card}>
                  <FontAwesome5 name="video" size={22} color="#042456" style={styles.icon} />
                  <Text style={styles.title}>Téléconsultation</Text>
                  <Text style={styles.text}>
                    Vous n’avez pas encore de téléconsultation prévue.
                  </Text>

                  <Button
                    title="Voir mes téléconsultations"
                    onPress={handleTeleconsultation}
                    variant="full"
                  />
                </View>
              )}
            </>
          )}

          {/* --- ECG Sensor section --- */}
          <View style={styles.card}>
            <FontAwesome name="heartbeat" size={22} color="#F35330" style={styles.icon} />
            <Text style={styles.title}>Capteur ECG</Text>
            <Text style={styles.text}>Votre capteur n'est pas encore connecté.</Text>

            <Button
              title="Connecter mon capteur ECG"
              onPress={handleEcg}
              variant="full"
            />
          </View>

          {/* --- Messaging section --- */}
          <View style={styles.card}>
            <FontAwesome name="envelope" size={22} color="#042456" style={styles.icon} />
            <Text style={styles.title}>Messagerie</Text>

            {/* --- Message preview list (recent messages) --- */}
            {messages.map((msg, index) => (
              <View key={index} style={styles.messageRow}>
                <MaterialIcons name="account-circle" size={35} color="#042456" style={styles.avatar} />
                <View style={styles.messageTextContainer}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.sender}>{msg.sender}</Text>
                    <Text style={styles.time}>{msg.time}</Text>
                  </View>
                  <Text style={styles.subject}>{msg.subject}</Text>
                </View>
              </View>
            ))}

            <Button
              title="Accéder à ma messagerie"
              onPress={handleMessaging}
              variant="full"
            />
          </View>
        </ScrollView>
      </View>

      {/* Fixed bottom navigation footer */}
      <FooterPatient />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with dark-blue background and full height
  container: {
    flex: 1,
    backgroundColor: "#042456",
  },
  // Scrollable content area between header and footer
  scrollArea: {
    flex: 1,
    marginTop: 70,
    marginBottom: 80,
  },
  // Inner padding for consistent content alignment
  scrollContainer: {
    paddingHorizontal: 12,
  },
  // Base card style for each dashboard section
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 7,
    padding: 10,
    position: "relative",
  },
  // Icon displayed at the top-right of each card
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  // Section title text
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#042456",
    marginBottom: 20,
  },
  // Informational text paragraphs
  text: {
    fontSize: 16,
    color: "#042456",
    marginBottom: 7,
  },
  // Appointment date text styling
  dateText: {
    fontSize: 16,
    color: "#042456",
    fontWeight: "500",
    marginBottom: 7,
  },

  /* --- Messaging section styles --- */
  // Row layout for each message preview
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  // Doctor avatar icon
  avatar: {
    marginRight: 10,
    marginTop: 2,
  },
  // Container wrapping message content
  messageTextContainer: {
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  // Header section displaying sender and timestamp
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  // Sender’s name text
  sender: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#042456",
  },
  // Message timestamp text
  time: {
    fontSize: 13,
    color: "#888",
  },
  // Message subject preview
  subject: {
    fontSize: 14,
    color: "#042456",
    opacity: 0.8,
  },
});
