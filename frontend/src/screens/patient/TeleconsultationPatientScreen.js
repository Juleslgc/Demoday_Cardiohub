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
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
 
  // Opens the Jitsi consultation in the browser using expo-web-browser
  const handleJoinConsultation = async (appointmentId) => {

    const data = await getTeleconsultationByAppointment(appointmentId);

    if (!data || !data.jitsiLink) {
      Alert.alert(
        "Téléconsultation indisponible",
        "La téléconsultation n'est pas encore créée pour ce rendez-vous."
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
              console.error("Erreur d'ouverture du navigateur :", error);
              Alert.alert("Erreur", "Impossible d’ouvrir la visioconférence.");
            }
          },
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
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
          ) : (
            filteredAppointments.map((patient) => (
              <View key={patient.id} style={styles.card}>
                {/* Date section */}
                <View style={styles.rowCenter}>
                  <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
                  <Text style={styles.title}>{patient.dateTime}</Text>
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
});
