import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from "react-native";
import FooterPro from "../../components/FooterPro";
import Button from "../../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// Functional component representing the teleconsultation area
export default function AppointmentScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(30); // par défaut 30 min
  const timeSlots = [
  "08:00", "09:00", "10:00",
  "11:00", "14:00", "15:00",
  "16:00", "17:00", "18:00"
  ];
  const durationSlots = [
  "30 min", "45 min", "60 min"
  ];

  // Rechercher les patients quand on tape dans le TextInput
  useEffect(() => {
    if (searchQuery.length < 2) return; // éviter trop de requêtes
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
  }, [searchQuery]);

  const handleDateChange = (text) => {
    // Supprime tout sauf les chiffres
    const cleaned = text.replace(/\D/g, '');

    let formatted = cleaned;

    if (cleaned.length >= 3 && cleaned.length <= 4) {
      formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2);
    } else if (cleaned.length > 4) {
      formatted = cleaned.slice(0,2) + '/' + cleaned.slice(2,4) + '/' + cleaned.slice(4,8);
    }

    setSelectedDate(formatted);
  };

  const getDateTimeISO = () => {
    if (!selectedDate || !selectedTime) return null;
    const [day, month, year] = selectedDate.split('/');
    return new Date(`${year}-${month}-${day}T${selectedTime}:00`).toISOString();
  };

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
      Alert.alert("Succès", "Rendez-vous créé !");
    } catch (err) {
      Alert.alert("Erreur", err.message);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* === Header personnalisé === */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="#042456" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Prise de rendez-vous</Text>
        </View>
      </View>
        {/* === Contenu défilant === */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={{marginBottom: -10}}>
            <Text style={styles.text}>Patients</Text>
            <View style={styles.searchSection}>
            <FontAwesome name="search" size={20} color="#042456" style={styles.searchIcon} />
              <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un patient"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              />
              <FlatList
              scrollEnabled={false}
              data={patients}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.patientItem, selectedPatient?.id === item.id && styles.patientSelected]}
                  onPress={() => setSelectedPatient(item)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
          )}
        />
          </View>
          </View>
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
          </View>
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
          <View style={{marginBottom: -10}}>
            <Text style={styles.text}>Durée</Text>
            <View style={styles.allActions}>
              {durationSlots.map((duration, index) => (
                <TouchableOpacity key={index} style={[styles.square, selectedDuration === duration && { backgroundColor: "#A9A9A9" }]} onPress={() => setSelectedDuration(duration)}>
                  <Text style={[styles.squareText, selectedDuration === duration && { color: '#fff' }]}>{duration}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{marginTop: 30}}>
            <TouchableOpacity style={styles.saveButton} onPress={handleCreateAppointment}>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      <FooterPro />
    </SafeAreaView>
  );
}
// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#042456",
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
  /** CONTENU SCROLLABLE **/
  scrollContainer: {
    padding: 12,
    paddingBottom: 100, // pour ne pas cacher le bas sous le footer
  },
  /** BARRE DE RECHERCHE **/
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
  allActions: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between', // espace uniforme entre les colonnes
  marginHorizontal: 10,
  marginBottom: -30
},
square: {
  width: '30%', // 3 colonnes → 30% + gaps
  aspectRatio: 1.5, // proportion pour faire 60x100 comme avant
  backgroundColor: '#fff',
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10, // espace vertical entre les lignes
},
squareText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#042456',
},
saveButton: {
  backgroundColor: '#fff',   // ton bleu principal
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
});