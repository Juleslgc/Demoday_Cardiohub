/**
 * PatientFileScreen Module
 * ------------------------------------------------------
 * This screen displays a patient's file to the healthcare professional.
 * It lists all consultation notes linked to the selected patient.
 *
 * Features:
 * - Displays patient information (name, age)
 * - Retrieves all appointments associated with the patient
 * - Fetches and displays notes for each appointment
 * - Shows a loading indicator while data is fetched
 * - Integrates consistent header and footer components
 *
 * Technical details:
 * - Uses `getAppointmentPro()` to retrieve all professional appointments
 * - Filters those matching the selected patient
 * - Uses `getNoteByAppointment()` to retrieve notes per appointment
 */

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from '../../components/FooterPro';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import calculateAge from "../../utils/CalculateAge";
import { getAppointmentPro, getNoteByAppointment } from "../../services/api";

/**
 * PatientFileScreen Component
 * ------------------------------------------------------
 * Displays the selected patient's information and all related notes.
 *
 * @param {object} route - Navigation route containing the selected patient data
 * @returns {JSX.Element} Patient file screen
 */

export default function PatientFileScreen({ route }) {
  const { patient } = route.params;

  // --- Local States ---
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches notes related to the current patient.
   * Each appointment for this patient is checked for associated notes.
   */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Retrieve all appointments of the logged-in professional
        const appointments = await getAppointmentPro();

        // Filter only those that belong to the current patient
        const patientAppointments = appointments.filter(
          (a) => a.patient && a.patient.id === patient.id
        );

        // Retrieve notes for each appointment
        const fetchedNotes = await Promise.all(
          patientAppointments.map(async (appt) => {
            try {
              const note = await getNoteByAppointment(appt.id);
              return {
                id: appt.id,
                date: appt.dateTime,
                description: note.description,
              };
            } catch (error) {
              // No note for this appointment
              return null;
            }
          })
        );

        // Keeps only valid notes
        const validNotes = fetchedNotes.filter((n) => n !== null);
        setNotes(validNotes);
      } catch (error) {
        console.error("Erreur lors du chargement des notes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [patient.id]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Dossier patient" />

      {/* === PATIENT CARD === */}
      <View style={styles.card}>
        <MaterialIcons name="account-circle" size={60} color="#042456" />
        <View style={styles.cardContent}>
          <Text style={styles.patientName}>{patient.firstName} {patient.lastName}</Text>
          <Text style={styles.patientAge}>{calculateAge(patient.birthDate)} ans</Text>
        </View>
      </View>

      {/* === DOCUMENTS & NOTES SECTION === */}
      <View style={styles.documentsCard}>
        <View style={styles.cardContent}>
          <Text style={styles.patientName}>Documents</Text>

          <View style={styles.documentsContent}>
            {/* --- Loading Indicator --- */}
            {loading ? (
              <ActivityIndicator size="small" color="#042456" />
            ) : notes.length > 0 ? (
              notes.map((note) => {
                const [datePart] = note.date?.split(" ") || [];
                return (
                  <View key={note.id} style={styles.noteItem}>
                    <View style={styles.noteHeader}>
                      <MaterialIcons name="attach-file" size={18} color="#042456" style={styles.clipIcon} />
                      <Text style={styles.cardSmall}>
                        <Text style={styles.bold}>Note téléconsultation - </Text>
                        {datePart}
                      </Text>
                    </View>

                    <Text style={styles.noteText}>{note.description}</Text>
                  </View>
                );
              })
            ) : (
              // --- Empty state ---
              <View style={styles.noDocumentItem}>
                <Text style={styles.cardSmall}>Aucun document associé.</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <FooterPro />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with background color
  container: {
    padding: 16,
    backgroundColor: '#042456',
    flex: 1,
  },
  // Patient card with name and age
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  // Container for patient documents/notes
  documentsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginBottom: 70,
  },
  // Content area for notes inside the documents card
  documentsContent: {
    marginTop: 5,
  },
  // Text container inside cards
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  // Patient name text
  patientName: {
    fontWeight: "700",
    fontSize: 18,
    color: "#042456",
  },
  // Patient age text
  patientAge: {
    fontSize: 16,
  },
  // Smaller text for card details
  cardSmall: {
    color: "#042456",
    fontSize: 14,
  },
  // Bold text in card subtitles
  bold: {
    fontWeight: "700",
    fontSize: 14,
  },
  // Each note container
  noteItem: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
  },
  // Note header with icon and title
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  // Paperclip icon before note title
  clipIcon: {
    marginRight: 6,
  },
  // Note text description
  noteText: {
    color: "#042456",
    fontSize: 13,
    marginTop: 4,
  },
  // Empty note placeholder
  noDocumentItem: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
  },
});
