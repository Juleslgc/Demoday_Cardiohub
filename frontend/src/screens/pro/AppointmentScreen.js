/**
 * AppointmentScreen
 * ------------------------------------------------------
 * This screen allows healthcare professionals to create new appointments.
 * It enables searching for a patient, selecting a date, time, and duration,
 * and sending the appointment information to the backend API.
 *
 * Features:
 * - Dynamic patient search by name
 * - Input validation (date format, future time, patient selection)
 * - Quick selection of time and duration slots
 * - Appointment creation via `createAppointment()` API
 * - Visual feedback for errors and selected options
 */

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from "../../components/FooterPro";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { searchPatientsByName, createAppointment } from "../../services/api";


/**
 * AppointmentScreen Component
 * ------------------------------------------------------
 * Screen dedicated to appointment creation by a healthcare professional.
 * Handles patient search, date/time input, and API communication.
 */

export default function AppointmentScreen({ navigation }) {
  // --- Screen states ---
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(30); // default 30 min

  // --- Time and duration slots ---
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const durationSlots = ["30", "45", "60"];

  // --- Fetch patients dynamically when typing ---
  useEffect(() => {
    if (searchQuery.length < 2) return; // avoid unnecessary API calls
    const fetchPatients = async () => {
      try {
        const results = await searchPatientsByName(searchQuery);
        setPatients(results);
      } catch (err) {
        console.error("Erreur recherche patient :", err);
      }
    };
    fetchPatients();
  }, [searchQuery])

  // --- Filter patients locally by name ---
  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  /**
   * Validates date and time fields.
   * Checks:
   * - correct format (dd/mm/yyyy)
   * - valid values
   * - not in the past
   * - patient selected
   */
  const isValidDate = () => {
    const errors = {
      empty: false,
      invalidFormat: false,
      invalidDayMonth: false,
      pastDate: false,
      patient: false,
    };

    if (!selectedPatient) {
      errors.patient =  true;
      return errors;
    }

    if (!selectedDate || !selectedTime) {
      errors.empty = true;
      return errors;
    }

    // Extracting the day/month/year
    const [dayStr, monthStr, yearStr] = selectedDate.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    // Format check
    if (!dayStr || !monthStr || !yearStr || dayStr.length !== 2 || monthStr.length !== 2 || yearStr.length !== 4) {
      errors.invalidFormat = true;
      return errors;
    }

    // Checking the values
    if (day < 1 || month < 1 || month > 12) {
      errors.invalidDayMonth = true;
      return errors;
    }

    const dateTime = new Date(`${year}-${month}-${day}T${selectedTime}:00`);

    // Checking for an exact match
    if (dateTime.getDate() !== day || dateTime.getMonth() + 1 !== month || dateTime.getFullYear() !== year) {
      errors.invalidDayMonth = true;
      return errors;
    }

    // Check if the date has passed
    if (dateTime < new Date()) {
      errors.pastDate = true;
      return errors;
    }

    return errors;
  };

  const dateErrors = isValidDate();

  /** Automatically formats the date as dd/mm/yyyy */
  const handleDateChange = (text) => {
    const cleaned = text.replace(/\D/g, ''); // keep digits only

    let formatted = cleaned;

    if (cleaned.length >= 3 && cleaned.length <= 4) {
      formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2);
    } else if (cleaned.length > 4) {
      formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2,4) + '/' + cleaned.slice(4,8);
    }

    setSelectedDate(formatted);
  };

  /** Converts selected date & time to ISO format */
  const getDateTimeISO = () => {
    if (!selectedDate || !selectedTime) return null;
    const [day, month, year] = selectedDate.split('/');
    return new Date(`${year}-${month}-${day}T${selectedTime}:00`).toISOString();
  };

  /** Creates the appointment via API */
  const handleCreateAppointment = async () => {
    const dateTimeISO = getDateTimeISO();
    try {
      await createAppointment({
        patientId: selectedPatient.id,
        dateTime: dateTimeISO,
        duration: selectedDuration
      });
      Alert.alert('Rendez-vous créé avec succès !');
      navigation.goBack();
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Prise de rendez-vous" />
      
      {/* --- Scrollable Content --- */}
      <ScrollView
        style={{ flex: 1, marginTop: 60 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.content}>
          {/* --- Patient Search Section --- */}
          <View style={[styles.sectionContainer, { position: "relative" }]}>
            <Text style={styles.text}>Patients</Text>

            {/* Search bar */}
            <View style={styles.searchSection}>
              <FontAwesome name="search" size={20} color="#042456" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un patient..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={async (text) => {
                  setSearchQuery(text);
                  setSelectedPatient(null); // deselect the patient if typing

                  if (text.length < 2) {
                    setPatients([]);
                    return;
                  }

                  // Call API to search patients
                  try {
                    const results = await searchPatientsByName(text);
                    setPatients(results);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              />
            </View>

            {/* Patient error message */}
            <View style={{ marginTop: -10}}>
              {dateErrors.patient && <Text style={styles.errorText}>Veuillez sélectioner un patient</Text>}
            </View>

            {/* Dropdown with patient suggestions */}
            {filteredPatients.length > 0 && !selectedPatient && (
              <View style={styles.dropdown}>
                {filteredPatients.map((patient) => (
                  <TouchableOpacity
                    key={patient.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedPatient(patient);
                      setSearchQuery(`${patient.lastName} ${patient.firstName}`);
                      setPatients([]); // ferme le dropdown
                    }}
                  >
                    <Text style={{color: "#042456"}}>{patient.lastName} {patient.firstName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* --- Date selection --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.text}>Date</Text>
            <View style={styles.searchSection}>
              <FontAwesome name="calendar" size={20} color="#042456" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="jj/mm/aaaa"
                placeholderTextColor="#666"
                value={selectedDate}
                onChangeText={handleDateChange}
                keyboardType="numeric"
              />
            </View>

            {/* Date validation messages */}
            <View style={{ marginTop: -10 }}>
              {dateErrors.invalidFormat && <Text style={styles.errorText}>Format incorrect, jj/mm/aaaa</Text>}
              {dateErrors.invalidDayMonth && <Text style={styles.errorText}>Jour ou mois ou année invalide</Text>}
              {dateErrors.pastDate && <Text style={styles.errorText}>La date ou l'heure est déjà passée</Text>}
              {dateErrors.empty && <Text style={styles.errorText}>Veuillez sélectionner la date et l'heure</Text>}
            </View>
          </View>

          {/* --- Time selection --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.text}>Heure</Text>
            <View style={styles.allActions}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.square, selectedTime === time && { backgroundColor: "#A9A9A9" }]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.squareText, selectedTime === time && { color: '#fff' }]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- Duration Selection --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.text}>Durée</Text>
            <View style={styles.allActions}>
              {durationSlots.map((duration, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.square, selectedDuration === duration && { backgroundColor: "#A9A9A9" }]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <Text style={[styles.squareText, selectedDuration === duration && { color: '#fff' }]}>{duration} min</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- Save Button --- */}
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleCreateAppointment}>
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FooterPro />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with primary background
  container: {
    flex: 1,
    backgroundColor: "#042456",
  },
  // Scrollable area configuration
  scrollContainer: {
    padding: 12,
    paddingBottom: 100,
    backgroundColor: "#042456",
  },
  // Content wrapper
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  // Shared block style for each section
  sectionContainer: {
    marginBottom: 20,
  },
  // Section titles (e.g., "Date", "Heure")
  text: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 10,
    marginLeft: 5,
  },
  // --- Search bar ---
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderRadius: 6,
    marginHorizontal: 10,
    marginBottom: 10,
    minHeight: 50,
    paddingLeft: 10,
    paddingRight: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#042456",
  },
  // Dropdown with patient suggestions
  dropdown: {
    backgroundColor: "#ccc",
    position: "absolute",
    top: 70,
    left: 10,
    right: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#aba9a9ff",
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#aba9a9ff",
  },
  // Container for time and duration buttons
  allActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: -70,
  },
  // Time/duration button style
  square: {
    width: '30%',
    aspectRatio: 1.5,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  squareText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#042456',
  },
  // Save button at the bottom
  saveButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 50,
  },
  saveButtonText: {
    color: '#042456',
    fontSize: 18,
    fontWeight: '600',
  },
  // Error message styling
  errorText: {
    color: 'red',
    marginLeft: 15,
    marginTop: 5,
    fontSize: 13,
  },
});
