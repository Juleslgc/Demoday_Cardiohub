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

import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import HeaderPatient from "../../components/HeaderPatient";
import FooterPatient from "../../components/FooterPatient";
import Button from "../../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getAppointmentPatient } from "../../services/api.js";

// Functional component representing the teleconsultation area
export default function TeleconsultationScreen() {
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

    // Convertir la date au format ISO
  const parseFrenchDate = (dateStr) => {
    // Exemple : "18/10/2025 14:00:00"
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

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPatient />

      <View style={styles.scrollArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#042456" />
          ) : (
            filteredAppointments.map((patient) => (
              <View style={styles.card}>
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
                  //onPress={onPress}
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
    marginTop: 70,      // header height (50) + margin of 20
    marginBottom: 80,   // footer height (60) + margin of 20
  },
  scrollContainer: {
    paddingHorizontal: 12, // Inner horizontal padding for content alignment
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
  text: {
    fontSize: 16,
    color: "#042456",
    fontWeight: "500",
  },
});
