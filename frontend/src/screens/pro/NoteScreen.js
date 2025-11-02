/**
 * NoteScreen
 * ------------------------------------------------------
 * This screen allows a healthcare professional to add
 * a note after completing a teleconsultation or appointment.
 *
 * Features:
 * - Displays summary information about the appointment (patient, date, time, duration)
 * - Provides a text input field to add a follow-up or consultation note
 * - Sends the note to the backend via the `createNote()` API
 * - Includes visual confirmation after saving
 * - Integrates a consistent header and footer layout
 */

import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HeaderPage from '../../components/HeaderPage';
import Footer from '../../components/FooterPro';
import { createNote } from "../../services/api";

/**
 * NoteScreen Component
 * ------------------------------------------------------
 * Displays appointment details and allows the professional
 * to add and save a consultation note.
 *
 * @param {object} navigation - React Navigation prop for navigation control
 * @param {object} route - Contains the appointment details passed from the previous screen
 * @returns {JSX.Element} Screen UI for adding a consultation note
 */

export default function NoteScreen({navigation, route}) {
  const { appointment } = route.params;
  
  // --- Local States ---
  const [description, setDescription] = useState('');

  /**
   * Handles note creation by sending data to the backend.
   * Displays a confirmation message on success.
   */
  const handleCreateNote = async () => {
    try {
      const appointmentId = appointment.id;
      const data = {description};

      await createNote(appointmentId, data);
      Alert.alert("La note a bien été enregistrée.")
      navigation.navigate('HomeProScreen');
    } catch (error) {
      Alert.alert("Erreur :", error.message);
    }
  };

  // --- Date and Time Formatting ---
  const [datePart, timePart] = appointment.dateTime.split(' ');
  const [hour, minute] = timePart ? timePart.split(':') : ['', ''];
  const formattedTime = `${hour}:${minute}`;

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderPage title="Téléconsultation terminée" />
  
      {/* --- Scrollable Content --- */}
      <ScrollView style={{ flex: 1, marginTop: 60 }} contentContainerStyle={styles.container}>

        {/* === APPOINTMENT CARD === */}
        <View style={styles.card}>
          <MaterialIcons name="account-circle" size={60} color="#042456" />
          <View style={styles.cardContent}>
            <Text style={styles.patientName}>{appointment.patient.firstName} {appointment.patient.lastName}</Text>
            <Text style={styles.cardSmall}>
              <Text style={styles.bold}>Rendez-vous du </Text>
              {datePart} <Text style={styles.bold}>à</Text> {formattedTime}
            </Text>

            <Text style={styles.cardSmall}>
              <Text style={styles.bold}>Durée : </Text>
              {appointment.duration} min
            </Text>
          </View>
        </View>

        {/* === NOTE SECTION === */}
        <Text style={styles.sectionTitle}>Ajouter une note</Text>

        {/* --- Textarea for note input --- */}
        <TextInput
          style={styles.textarea}
          value={description}
          onChangeText={setDescription}
          placeholder="Saisissez votre note de consultation..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={8}
        />

        {/* --- Save Button --- */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8} onPress={handleCreateNote}
        >
          <Text style={styles.saveButtonText}>Enregistrer la note</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Safe area background and layout
  safe: {
    flex: 1,
    backgroundColor: "#042456",
  },
  // Main scroll container
  container: {
    padding: 12,
    backgroundColor: '#042456',
    flex: 1,
  },
  // Appointment info card
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  // Card content layout
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  // Patient name text
  patientName: {
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 6,
    color: "#042456",
  },
  // Smaller appointment detail text
  cardSmall: {
    color: "#042456",
    fontSize: 14,
  },
  // Bold text within appointment info
  bold: {
    fontWeight: "700",
  },
  // Section title
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 30,
  },
  // Textarea for note input
  textarea: {
    backgroundColor: "#fff",
    textAlignVertical: "top",
    borderRadius: 10,
    padding: 12,
    minHeight: 180,
    fontSize: 14,
    marginBottom: 30,
    color: "#333",
  },
  // Save note button
  saveButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  // Save button text
  saveButtonText: {
    color: "#042456",
    fontWeight: "700",
    fontSize: 17,
  },
});
