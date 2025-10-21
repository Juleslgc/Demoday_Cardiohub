import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import HeaderPage from '../../components/HeaderPage';
import Footer from '../../components/FooterPro';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(null);

  // Exemple de rendez-vous simulés
  const appointments = {
    '2025-10-21': [
      { id: '1', title: 'Dentiste à 10h' },
      { id: '2', title: 'Réunion à 14h' },
    ],
    '2025-10-22': [
      { id: '3', title: 'Cours de yoga à 18h' },
    ],
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Agenda" />
      <Calendar
        style={{marginTop: 50}}
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#042456' },
        }}
      />

      {selectedDate && (
        <View style={styles.appointmentsContainer}>
          <Text style={styles.dateTitle}>Rendez-vous du {selectedDate}</Text>
          {appointments[selectedDate] ? (
            <FlatList
              data={appointments[selectedDate]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Text style={styles.appointmentItem}>- {item.title}</Text>
              )}
            />
          ) : (
            <Text style={{color: "#fff"}}>Aucun rendez-vous</Text>
          )}
        </View>
      )}
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#042456',
  },
  appointmentsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#fff"
  },
  appointmentItem: {
    fontSize: 16,
    marginBottom: 5,
    color: "#fff"
  },
});
