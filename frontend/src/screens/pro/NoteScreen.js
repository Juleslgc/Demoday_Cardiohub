import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HeaderPage from '../../components/HeaderPage';
import Footer from '../../components/FooterPro';
import { createNote, getAppointmentPro } from "../../services/api";


export default function NoteScreen({navigation, route}) {
  const { appointment } = route.params;
  // --- Local States ---
  const [description, setDescription] = useState('');

  const handleCreateNote = async () => {
    try {
      const appointmentId = appointment.id;
      const data = {description};

      await createNote(appointmentId, data);
      navigation.navigate('HomeProScreen');
    } catch (error) {
      Alert.alert("Erreur :", error.message);
    }
  }

  const [datePart, timePart] = appointment.dateTime.split(' ');
  const [hour, minute] = timePart ? timePart.split(':') : ['', ''];
  const formattedTime = `${hour}:${minute}`;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeProScreen')}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={26} color="#042456" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Téléconsultation terminée</Text>
          </View>
        </View>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Patient Card */}

        <View style={styles.card}>
          <MaterialIcons name="account-circle" size={53} color="#042456" />
          <View style={styles.cardContent}>
            <Text style={styles.patientName}>{appointment.patient.firstName} {appointment.patient.lastName}</Text>
            <Text style={styles.cardSmall}>Rendez-vous du {datePart} à {formattedTime}</Text>
            <Text style={styles.cardSmall}>Durée : {appointment.duration} min</Text>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Ajouter une note</Text>

        {/* Textarea */}
        <TextInput
          style={styles.textarea}
          value={description}
          onChangeText={setDescription}
          placeholder="Saisissez votre note de consultation..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={8}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleCreateNote}>
          <Text style={styles.saveButtonText}>Enregistrer la note</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    backgroundColor: '#042456',
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backArrow: {
    color: "#fff",
    fontSize: 20,
    marginRight: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardContent: {
    flex: 1,
  },
  patientName: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
    color: "#042456",
  },
  cardSmall: {
    color: "#042456",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 30
  },
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
  saveButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#042456",
    fontWeight: "700",
  },
   header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 50,
    paddingHorizontal: 10,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 10,
    zIndex: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#042456",
  },
});
