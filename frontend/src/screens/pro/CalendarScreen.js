import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import HeaderPage from '../../components/HeaderPage';
import Footer from '../../components/FooterPro';
import { getAppointmentPro } from "../../services/api";

export default function CalendarScreen() {
  const [appointments, setAppointments] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chargement des rendez-vous à chaque focus de la page
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchAppointment = async () => {
        try {
          setLoading(true);
          const response = await getAppointmentPro();
          console.log(response);
          const data = Array.isArray(response) ? response : response.appointments || [];

          if (isActive) {
            setAppointments(data);
            // Convertit les rendez-vous en "markedDates"
            const marks = {};
            data.forEach((rdv) => {
              const rawDate = rdv.dateTime; // <-- ton champ
              if (rawDate) {
                // Conversion du format "27/10/2025 14:00:00" en "2025-10-27"
                const [day, month, yearAndTime] = rawDate.split('/');
                const [year] = yearAndTime.split(' ');
                const formattedDate = `${year}-${month}-${day}`;
                marks[formattedDate] = { marked: true, dotColor: '#00BFFF' };
              }
            });
            setMarkedDates(marks);
          }
        } catch (err) {
          console.error('Erreur lors du chargement des rendez-vous :', err);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchAppointment();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Filtre les rendez-vous pour la date sélectionnée
  const rdvForSelectedDate = appointments.filter((rdv) => {
    if (!rdv.dateTime) return false;
    const [day, month, yearAndTime] = rdv.dateTime.split('/');
    const [year] = yearAndTime.split(' ');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate === selectedDate;
  });

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Agenda" />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <>
          <Calendar
            style={{ marginTop: 50 }}
            onDayPress={handleDayPress}
            theme={{
              calendarBackground: '#042456',
              dayTextColor: '#fff',
              monthTextColor: '#fff',
              arrowColor: '#fff',
              todayTextColor: '#00BFFF',
            }}
            markedDates={{
              ...markedDates,
              ...(selectedDate && {
                [selectedDate]: {
                  selected: true,
                  selectedColor: '#00BFFF',
                  marked: markedDates[selectedDate]?.marked,
                  dotColor: '#fff',
                },
              }),
            }}
          />

          {selectedDate && (
            <View style={styles.appointmentsContainer}>
              <Text style={styles.dateTitle}> Rendez-vous du {selectedDate ? selectedDate.split('-').reverse().join('/') : ''}</Text>

              {rdvForSelectedDate.length > 0 ? (
                <FlatList
                  data={rdvForSelectedDate}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <Text style={styles.appointmentItem}>
                      • {item.patient?.firstName} {item.patient?.lastName} - {item.dateTime}
                    </Text>
                  )}
                />
              ) : (
                <Text style={{ color: '#fff' }}>Aucun rendez-vous</Text>
              )}
            </View>
          )}
        </>
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
