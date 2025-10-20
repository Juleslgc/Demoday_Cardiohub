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

import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderPage from "../../components/HeaderPage";
import FooterPatient from "../../components/FooterPatient";
import Button from "../../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getTeleconsultationByAppointment } from "../../services/api";

/**
 * TeleconsultationScreen (Patient)
 * ----------------------------------
 * Affiche les détails d'une téléconsultation et
 * permet au patient de rejoindre une salle Jitsi.
 */

// Functional component representing the teleconsultation area
export default function TeleconsultationPatientScreen() {
  const navigation = useNavigation();
  const [teleconsultation, setTeleconsultation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Id temporaire pour test
  const appointmentId = "94423030-694d-463e-9da7-526d37030823";

  // Récupération périodique de la téléconsultation
  const fetchTeleconsultation = async () => {
    try {
      const data = await getTeleconsultationByAppointment(appointmentId);
      setTeleconsultation(data);
    } catch (error) {
      console.log("En attente de la création de la salle...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeleconsultation();
    const interval = setInterval(fetchTeleconsultation, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  // Ouvre la consultation dans le navigateur
  const handleJoinConsultation = () => {
    if (!teleconsultation?.jitsiLink) {
      Alert.alert("En attente du professionnel...", "La salle n'est pas encore ouverte");
      return;
    }
    Alert.alert(
      "Rejoindre la consultation",
      "Vous allez être redirigé vers votre navigateur pour rejoindre la visio.",
      [
        {
          text: "Ouvrir maintenant",
          onPress: () => Linking.openURL(teleconsultation.jitsiLink),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Téléconsultations" />

      <View style={styles.scrollArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.card}>
            {/* Date section */}
            <View style={styles.rowCenter}>
              <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
              <Text style={styles.title}>16/10/2025 - 14h00</Text>
            </View>

            {/* Doctor section */}
            <View style={styles.rowCenter}>
              <FontAwesome6 name="user-doctor" size={22} color="#042456" style={styles.iconInline} />
              <Text style={styles.text}>Dr. DUPONT</Text>
            </View>

            {/* Button */}
            <Button
              title={teleconsultation?.jitsiLink ? "Rejoindre la consultation" : "En attente du pro..."}
              onPress={handleJoinConsultation}
              variant="full"
              disabled={!teleconsultation?.jitsiLink}
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
