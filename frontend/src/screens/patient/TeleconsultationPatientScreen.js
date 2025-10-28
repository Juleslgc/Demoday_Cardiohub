/**
 * Teleconsultation Patient Screen
 * ----------------------------------------------------
 * React Native screen allowing a patient to access their teleconsultation session.
 * Designed to work with `expo-web-browser`, similar to the professional side.
 *
 * Responsibilities:
 * - Periodically fetch the teleconsultation details linked to a given appointment
 * - Open the Jitsi video consultation in the mobile browser
 * - Display relevant appointment and doctor information
 *
 * Notes:
 * - The teleconsultation link is refreshed every 10 seconds until available.
 * - Uses a temporary appointment ID for testing purposes.
 * - Automatically redirects the patient back to the home screen after closing the browser.
 */

import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderPage from "../../components/HeaderPage";
import FooterPatient from "../../components/FooterPatient";
import Button from "../../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getTeleconsultationByAppointment, getAppointmentPatient } from "../../services/api";
import * as WebBrowser from "expo-web-browser";

export default function TeleconsultationPatientScreen() {
  const navigation = useNavigation();
  const [teleconsultation, setTeleconsultation] = useState(null);
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

    // Convert the date to ISO format
  const parseFrenchDate = (dateStr) => {
    // Example : "18/10/2025 14:00:00"
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  };

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

  // Filtrage dynamique
  const filteredAppointments = appointment.filter((appointment) => {
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

    return true;
  })
  .slice()
  .sort((a, b) => new Date(parseFrenchDate(a.dateTime)) - new Date(parseFrenchDate(b.dateTime)));

  // Opens the Jitsi consultation in the browser using expo-web-browser
  const handleJoinConsultation = async (appointmentId) => {
    try {
      let data;
      try {
        data = await getTeleconsultationByAppointment(appointmentId);
      } catch (error) {
        Alert.alert(
          "Salle non encore ouverte",
          "Votre professionnel de santé n’a pas encore lancé la téléconsultation.",
          [{ text: "OK" }]
        );
        return;
      }
  
      if (!data || data.message || !data.jitsiLink) {
        Alert.alert(
          "Salle non encore ouverte",
          "Votre professionnel de santé n’a pas encore lancé la téléconsultation.",
          [{ text: "OK" }]
        );
        return;
      }
    
      const jitsiLink = data.jitsiLink;

    Alert.alert(
      "Rejoindre la consultation",
      "Vous allez être redirigé vers la visioconférence.",
      [
        {
          text: "Ouvrir",
          onPress: async () => {
            try {
              // Opens the browser with the teleconsultation link
              const result = await WebBrowser.openBrowserAsync(jitsiLink, {
                presentationStyle: "pageSheet", // iOS appearance style
                controlsColor: "#042456",       // iOS toolbar color
                toolbarColor: "#fff",        // Android toolbar color
              });

              // When the user closes the browser → navigate back to the home screen
              if (result.type === "dismiss") {
                navigation.navigate("HomePatientScreen");
              }
            } catch (error) {
              Alert.alert("Erreur", "Impossible d’ouvrir la visioconférence.");
            }
          },
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  } catch (error) {
    Alert.alert("Erreur", "Une erreur est survenue lors de la tentative de connexion.");
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Téléconsultations"/>

      <View style={styles.scrollArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#042456" />
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((patient) => (
              <View key={patient.id} style={styles.card}>
                {/* Date section */}
                <View style={styles.rowCenter}>
                  <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
                  <Text style={styles.dateText}>{formatDateTime(patient.dateTime)}</Text>
                </View>

                {/* Doctor section */}
                <View style={styles.rowCenter}>
                  <FontAwesome6 name="user-doctor" size={22} color="#042456" style={styles.iconInline} />
                  <Text style={styles.text}>Dr. {patient.pro.lastName}</Text>
                </View>

                {/* Button */}
                <Button
                  title="Rejoindre la consultation"
                  onPress={() => handleJoinConsultation(patient.id)}
                  variant="full"
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Aucune téléconsultation disponible</Text>
              <Text style={styles.emptyText}>
                Vous n’avez actuellement aucune téléconsultation prévue ni passée.
              </Text>
              <Text style={styles.emptyText}>
                Votre professionnel de santé vous en programmera une lorsque ce sera nécessaire.
              </Text>
            </View>
          )}

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
    marginTop: 70,
    marginBottom: 80,
  },
  scrollContainer: {
    paddingHorizontal: 12,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 7,
    padding: 10,
    position: "relative",
  },
  dateText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#042456",
  },  
  iconInline: {
    marginRight: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    color: "#042456",
  },
  text: {
    fontSize: 16,
    color: "#042456",
    fontWeight: "500",
  },
  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#042456",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#042456",
    textAlign: "center",
    marginBottom: 8,
    opacity: 0.8,
  },
});
