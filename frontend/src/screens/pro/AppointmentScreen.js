import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from "react-native";
import FooterPro from "../../components/FooterPro";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { searchPatientsByName, createAppointment } from "../../services/api";

/**
* Screen for creating an appointment for a professional.
* Allows the user to:
*  - search for a patient,
*  - choose a date, time, and duration,
*  - and then create an appointment in the database. 
*/
export default function AppointmentScreen({ navigation }) {
  // --- Screen states ---
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(30); // default 30 min
  // Proposed time slots
  const timeSlots = [
  "08:00", "09:00", "10:00",
  "11:00", "14:00", "15:00",
  "16:00", "17:00", "18:00"
  ];
  // Proposed durations
  const durationSlots = [
  "30", "45", "60"
  ];

  // Search for patients as soon as the search query exceeds 2 characters
  useEffect(() => {
    if (searchQuery.length < 2) return; // avoid too many requests
    const fetchPatients = async () => {
      try {
        const results = await searchPatientsByName(searchQuery);
        setPatients(results);
      } catch (err) {
        console.error(err);
        Alert.alert("Erreur", err.message);
      }
    };
    fetchPatients();
  }, [searchQuery])

  // Local filtering to keep only the matching patients
  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true; // si rien n'est tapé, on garde tout
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  /**
  * Checks the validity of the entered date:
  * - correct format (dd/mm/yyyy)
  * - valid day/month
  * - not in the past
  */
  const isValidDate = () => {
    const errors = {
      empty: false,
      invalidFormat: false,
      invalidDayMonth: false,
      pastDate: false,
    };

    // Empty fields
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

  /**
  * Automatically formats the date input as dd/mm/yyyy
  * Example: 01022025 → 01/02/2025
  */
  const handleDateChange = (text) => {
    // Removes everything except the numbers
    const cleaned = text.replace(/\D/g, '');

    let formatted = cleaned;

    if (cleaned.length >= 3 && cleaned.length <= 4) {
      formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2);
    } else if (cleaned.length > 4) {
      formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2,4) + '/' + cleaned.slice(4,8);
    }

    setSelectedDate(formatted);
  };

  /**
  * Transforms the selected date and time into an ISO format usable by the API.
  */
  const getDateTimeISO = () => {
    if (!selectedDate || !selectedTime) return null;
    const [day, month, year] = selectedDate.split('/');
    return new Date(`${year}-${month}-${day}T${selectedTime}:00`).toISOString();
  };

  /**
  *  Appointment creation
  * API call: createAppointment()
  */
  const handleCreateAppointment = async () => {
    if (!selectedPatient) return Alert.alert("Erreur", "Veuillez sélectionner un patient");
    if (!selectedDate || !selectedTime) return Alert.alert("Erreur", "Veuillez sélectionner la date et l'heure");

    const dateTimeISO = getDateTimeISO();
    try {
      await createAppointment({
        patientId: selectedPatient.id,
        dateTime: dateTimeISO,
        duration: selectedDuration
      });
      navigation.goBack(); // return to the list of appointments
    } catch (err) {
      Alert.alert("Erreur", err.message);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* === HEADER === */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="#042456" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Prise de rendez-vous</Text>
        </View>
      </View>
        {/* === SCROLLABLE CONTENT === */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={{marginBottom: -10}}>
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

                  // Appel API pour rechercher les patients
                  try {
                    const results = await searchPatientsByName(text);
                    setPatients(results);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              />
            </View>

            {/* Dropdown list of patients */}
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
            {/* Dynamic error display */}
            <View style={{ marginTop: -40, marginBottom: 20 }}>
              {dateErrors.invalidFormat && <Text style={styles.errorText}>Format incorrect, jj/mm/aaaa</Text>}
              {dateErrors.invalidDayMonth && <Text style={styles.errorText}>Jour ou mois ou année invalide</Text>}
              {dateErrors.pastDate && <Text style={styles.errorText}>La date ou l'heure est déjà passée</Text>}
            </View>
          </View>
          {/* --- Time selection --- */}
          <View style={{marginBottom: -10}}>
            <Text style={styles.text}>Heure</Text>
            <View style={styles.allActions}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity key={index} style={[styles.square, selectedTime === time && { backgroundColor: "#A9A9A9" }]} onPress={() => setSelectedTime(time)}>
                  <Text style={[styles.squareText, selectedTime === time && { color: '#fff' }]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* --- Duration selection --- */}
          <View style={{marginBottom: -10}}>
            <Text style={styles.text}>Durée</Text>
            <View style={styles.allActions}>
              {durationSlots.map((duration, index) => (
                <TouchableOpacity key={index} style={[styles.square, selectedDuration === duration && { backgroundColor: "#A9A9A9" }]} onPress={() => setSelectedDuration(duration)}>
                  <Text style={[styles.squareText, selectedDuration === duration && { color: '#fff' }]}>{duration} min</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* --- Save button --- */}
          <View style={{marginTop: 30}}>
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleCreateAppointment}>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      {/* === FOOTER === */}
      <FooterPro />
    </SafeAreaView>
  );
}
// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /** HEADER **/
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 50,
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
  text: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 10,
    marginLeft: 10,
  },
  /** SCROLLABLE CONTENT **/
  scrollContainer: {
    padding: 12,
    paddingBottom: 100, // to prevent the bottom from being hidden under the footer
    backgroundColor: "#042456"
  },
  /** SEARCH BAR **/
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
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#042456",
  },
  dropdown: {
  backgroundColor: "#ccc",
  borderRadius: 6,
  marginHorizontal: 10,
  marginTop: -40,
  marginBottom: 20,
  maxHeight: 150,
  borderWidth: 1,
  borderColor: "#aba9a9ff",
  zIndex: 5, // make sure it's on top
},
dropdownItem: {
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#aba9a9ff",
},

  allActions: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between', // uniform spacing between columns
  marginHorizontal: 10,
  marginBottom: -30
},
square: {
  width: '30%', // 3 columns → 30% + gaps
  aspectRatio: 1.5, // proportion to make it 60x100 as before
  backgroundColor: '#fff',
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10, // vertical space between the lines
},
squareText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#042456',
},
saveButton: {
  backgroundColor: '#fff', // main blue tone
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
errorText: {
  color: 'red',
  marginLeft: 15,
  marginTop: 5,
  fontSize: 13,
},
});