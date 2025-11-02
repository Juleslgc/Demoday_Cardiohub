/**
 * EditAppointmentScreen
 * ------------------------------------------------------
 * This screen allows a healthcare professional to edit an existing appointment.
 * It displays the patient’s information and provides inputs to modify the date,
 * time, and duration of the selected appointment.
 *
 * Features:
 * - View patient details (non-editable)
 * - Modify appointment date, time, and duration
 * - Validate the input fields (format, future date, completeness)
 * - Submit changes to the backend via `updatedAppointment()`
 */

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from "react-native";
import FooterPro from "../../components/FooterPro";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { updatedAppointment } from "../../services/api";
import HeaderPage from "../../components/HeaderPage";

/**
 * EditAppointmentScreen Component
 * ------------------------------------------------------
 * Enables a professional to edit an existing appointment.
 * Handles validation, data formatting, and API update requests.
 *
 * @param {object} navigation - React Navigation prop for navigation control.
 * @param {object} route - Contains the selected appointment passed from the previous screen.
 * @returns {JSX.Element} Editable appointment form.
 */

export default function EditAppointmentScreen({ navigation, route }) {
  const { appointment } = route.params; // Appointment passed from previous screen

  // --- Local States ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(30); // default 30 min

  // --- Time slots available and possible durations ---
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const durationSlots = ["30", "45", "60"];

  /**
   * Validates the selected date and time before submission.
   * Returns an object with flags for detected errors.
   */
  const isValidDate = () => {
    const errors = {
      empty: false,
      invalidFormat: false,
      invalidDayMonth: false,
      pastDate: false,
    };

    // Check if fields are empty
    if (!selectedDate || !selectedTime) {
      errors.empty = true;
      return errors;
    }

    // Extract day/month/year
    const [dayStr, monthStr, yearStr] = selectedDate.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    // Check format
    if (!dayStr || !monthStr || !yearStr || dayStr.length !== 2 || monthStr.length !== 2 || yearStr.length !== 4) {
      errors.invalidFormat = true;
      return errors;
    }

    // Check valid day/month values
    if (day < 1 || month < 1 || month > 12) {
      errors.invalidDayMonth = true;
      return errors;
    }

    const dateTime = new Date(`${year}-${month}-${day}T${selectedTime}:00`);

    // Ensure entered date matches expected
    if (dateTime.getDate() !== day || dateTime.getMonth() + 1 !== month || dateTime.getFullYear() !== year) {
      errors.invalidDayMonth = true;
      return errors;
    }

    // Prevent past appointments
    if (dateTime < new Date()) {
      errors.pastDate = true;
      return errors;
    }

    return errors;
  };

  const dateErrors = isValidDate();

  /** Formats date input into dd/mm/yyyy automatically */
  const handleDateChange = (text) => {
    const cleaned = text.replace(/\D/g, ''); // Keep only digits

    let formatted = cleaned;

    if (cleaned.length >= 3 && cleaned.length <= 4) {
      formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2);
    } else if (cleaned.length > 4) {
      formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2,4) + '/' + cleaned.slice(4,8);
    }

    setSelectedDate(formatted);
  };

  /** Converts selected date/time into ISO format (for API) */
  const getDateTimeISO = () => {
    if (!selectedDate || !selectedTime) return null;
    const [day, month, year] = selectedDate.split('/');
    return new Date(`${year}-${month}-${day}T${selectedTime}:00`).toISOString();
  };

  /** Handles appointment update and API call */
  const handleEditAppointment = async () => {
    if (!selectedDate || !selectedTime) return Alert.alert("Erreur", "Veuillez sélectionner la date et l'heure");

    const dateTimeISO = getDateTimeISO();
    try {
      const result = await updatedAppointment(appointment.id, {
        patientId: appointment.patient.id,
        dateTime: dateTimeISO,
        duration: selectedDuration
      });
      Alert.alert("Succès", "Le rendez-vous a été modifié avec succès !");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erreur", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Modification de rendez-vous" />

      {/* --- Scrollable content --- */}
      <ScrollView
        style={{ flex: 1, marginTop: 60 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* --- Patient Information --- */}
        <View style={{marginBottom: -10}}>
          <Text style={styles.text}>Patients</Text>
          <View style={styles.searchSection}>
            <Text style={styles.textPatient}>{appointment.patient.lastName} {appointment.patient.firstName}</Text>
          </View>
        </View>

        {/* --- Date Selection --- */}
        <View style={{marginBottom: -10}}>
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

          {/* Dynamic error messages */}
          <View style={{ marginTop: -40, marginBottom: 20 }}>
            {dateErrors.invalidFormat && <Text style={styles.errorText}>Format incorrect, jj/mm/aaaa</Text>}
            {dateErrors.invalidDayMonth && <Text style={styles.errorText}>Jour ou mois ou année invalide</Text>}
            {dateErrors.pastDate && <Text style={styles.errorText}>La date ou l'heure est déjà passée</Text>}
          </View>
        </View>

        {/* --- Time Selection --- */}
        <View style={{marginBottom: -10}}>
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
        <View style={{marginBottom: -10}}>
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
        <View style={{marginTop: 30}}>
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleEditAppointment}>
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
  // Root container with background color
  container: {
    flex: 1,
    backgroundColor: "#042456",
  },
  // Scrollable content padding
  scrollContainer: {
    padding: 12,
    paddingBottom: 100, // Prevents overlap with footer
    backgroundColor: "#042456",
  },
  // Section title text (e.g., Date, Heure)
  text: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 10,
    marginLeft: 10,
  },
  // Patient info input container
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderRadius: 6,
    marginHorizontal: 10,
    marginBottom: 40,
    minHeight: 50,
    paddingLeft: 10,
    paddingRight: 5,
  },
  // Patient name text
  textPatient: {
    color: "#042456",
  },
  // Calendar icon
  searchIcon: {
    marginRight: 10,
  },
  // Date input field
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#042456",
  },
  // Time & duration button container
  allActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: -30,
  },
  // Button style for selectable time/duration
  square: {
    width: '30%',
    aspectRatio: 1.5,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Text inside time/duration buttons
  squareText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#042456',
  },
  // Save button styling
  saveButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#042456',
    fontSize: 18,
    fontWeight: '600',
  },
  // Error message under inputs
  errorText: {
    color: 'red',
    marginLeft: 15,
    marginTop: 5,
    fontSize: 13,
  },
});
