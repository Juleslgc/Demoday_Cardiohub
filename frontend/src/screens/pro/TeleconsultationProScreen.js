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

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import HeaderPatient from "../components/HeaderPatient";
import FooterPatient from "../components/FooterPatient";
import Button from "../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Functional component representing the teleconsultation area
export default function TeleconsultationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPatient />

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
              title="Rejoindre la consultation"
              //onPress={onPress}
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
