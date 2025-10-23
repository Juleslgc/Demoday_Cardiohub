/** 
 * A React Native screen displaying the patient's home dashboard.
 *
 * Features:
 * - Displays three main sections: Teleconsultation, ECG Sensor, and Messaging
 * - Each section provides quick access to relevant features
 * - Uses custom reusable components (HeaderPatient, FooterPatient, Button)
 * - Scrollable layout with consistent styling and responsive design
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
import { getAppointmentPatient } from "../../services/api.js";

// Functional component representing the patient's main home screen
export default function HomePatientScreen({ navigation }) {
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchAppointment = async () => {
        try {
          setLoading(true);
          const response = await getAppointmentPatient();
          const data = Array.isArray(response) ? response : (response && response.appointment) ? response.appointment : [];
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
  const recentAppointment = appointment
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 1);

  // --- Navigation Handlers ---
  // Each function redirects the user to a specific patient feature screen
  const handleTeleconsultation = () => {
    navigation.navigate("TeleconsultationScreen");
  };

  const handleMessaging = () => {
    navigation.navigate("MessagingScreen");
  };

  const handleEcg = () => {
    navigation.navigate("EcgScreen");
  };

  // Mock data for demonstration
  // Sample messages displayed in the messaging preview card
  const messages = [
    { sender: "Dr. DUPONT", subject: "Résultat de votre ECG", time: "09:45" },
    { sender: "Dr. LEROY", subject: "Compte-rendu de consultation", time: "Hier" },
  ];

  return (
    // SafeAreaView ensures proper layout on devices with notches or curved screens
    <SafeAreaView style={styles.container}>
      <HeaderPatient />

      {/* Scrollable main content area */}
      <View style={styles.scrollArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#042456" />
          ) : (
            recentAppointment.map((patient) => (
              <View key={patient.id} style={styles.card}>
                <FontAwesome5 name="video" size={22} color="#042456" style={styles.icon} />
                <Text style={styles.title}>Téléconsultation</Text>
                <Text style={styles.text}>Prochain rendez-vous :</Text>
                <Text style={styles.text}>{patient.dateTime}</Text>
                <Text style={styles.text}>Dr {patient.pro.lastName} - {patient.pro.speciality}</Text>

                <Button
                  title="Voir mes téléconsultations"
                  onPress={handleTeleconsultation}
                  variant="full"
                />
              </View>
            ))
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
                <FontAwesome name="user-circle-o" size={35} color="#042456" style={styles.avatar} />
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

      <FooterPatient />
    </SafeAreaView>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#042456",
  },
  scrollArea: {
    flex: 1,
    marginTop: 70,      // header height (50) + margin of 20
    marginBottom: 80,   // footer height (60) + margin of 20
  },
  scrollContainer: {
    paddingHorizontal: 12, // Inner horizontal padding for content alignment
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,   // Vertical space between cards
    borderRadius: 7,
    padding: 10,
    position: "relative", // Allows icon positioning
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,          // Positions the icon at top-right of the card
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#042456",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#042456",
    marginBottom: 7,
  },

  /* Messaging section styles */
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatar: {
    marginRight: 10,
    marginTop: 2,
  },
  messageTextContainer: {
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  sender: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#042456",
  },
  time: {
    fontSize: 13,
    color: "#888",
  },
  subject: {
    fontSize: 14,
    color: "#042456",
    opacity: 0.8,
  },
});