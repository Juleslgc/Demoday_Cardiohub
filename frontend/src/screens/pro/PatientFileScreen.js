import React, { use, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from '../../components/FooterPro';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import calculateAge from "../../utils/CalculateAge";
import { getAppointmentPro, getNoteByAppointment } from "../../services/api";


export default function PatientFileScreen({ route }) {
  const { patient } = route.params;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Retrieve all the professional's appointments
        const appointments = await getAppointmentPro();

        // Filter those of the current patient
        const patientAppointments = appointments.filter(
          (a) => a.patient && a.patient.id === patient.id
        );

        // Call the API for each appointment to get the note
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
              // No note for this appointment, we don't know
              return null;
            }
          })
        );

        // Keeps only existing notes
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

      {/* Patient Card */}
      <View style={styles.card}>
        <MaterialIcons name="account-circle" size={60} color="#042456" />
        <View style={styles.cardContent}>
          <Text style={styles.patientName}>{patient.firstName} {patient.lastName}</Text>
          <Text style={styles.patientAge}>{calculateAge(patient.birthDate)} ans</Text>
        </View>
      </View>

      {/* Documents list */}
      <View style={styles.documentsCard}>
        <View style={styles.cardContent}>
          <Text style={styles.patientName}>Documents</Text>

          <View style={styles.documentsContent}>
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#042456',
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },

  documentsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginBottom: 70,
  },

  documentsContent: {
    marginTop: 5,
  },

  cardContent: {
    flex: 1,
    marginLeft: 10,
  },

  patientName: {
    fontWeight: "700",
    fontSize: 18,
    color: "#042456",
  },

  patientAge: {
    fontSize: 16,
  },
  cardSmall: {
    color: "#042456",
    fontSize: 14,
  },
  bold: {
    fontWeight: "700",
    fontSize: 14
  },
  
  noteItem: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  
  clipIcon: {
    marginRight: 6,
  },
  
  noteText: {
    color: "#042456",
    fontSize: 13,
    marginTop: 4,
  },
  documentItem: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
  },
  
  noDocumentItem: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
  },
  
});
