import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import HeaderPage from '../../components/HeaderPage';
import Footer from '../../components/FooterPro';
import { getAppointmentPro } from "../../services/api";

/**
* Schedule Screen (professional)
* Displays a calendar with days containing appointments,
* and lists the appointments for the selected day. 
*/
export default function CalendarScreen() {
  // --- Local States ---
  const [appointments, setAppointments] = useState([]); // complete list of appointments
  const [markedDates, setMarkedDates] = useState({}); // days marked on the calendar
  const [selectedDate, setSelectedDate] = useState(null); // currently selected day
  const [loading, setLoading] = useState(false); // loading indicator

  // --- Calendar configuration in French ---
  LocaleConfig.locales['fr'] = {
    monthNames: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    monthNamesShort: [
      'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
      'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'
    ],
    dayNames: [
      'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
    ],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
  };

  // Activates the French language by default
  LocaleConfig.defaultLocale = 'fr';

  /**
  * Automatically loads appointments every time
  * the page is displayed (screen is in focus).
  */
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchAppointment = async () => {
        try {
          setLoading(true);
          const response = await getAppointmentPro();
          const data = Array.isArray(response) ? response : response.appointments || [];

          if (isActive) {
            setAppointments(data);
            // Converts the appointments into a "markedDates" object
            const marks = {};
            data.forEach((rdv) => {
              const rawDate = rdv.dateTime; // <-- ton champ
              if (rawDate) {
                // Conversion from FR format to ISO format
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
      // Cleanup: prevents state updates after unmounting
      return () => {
        isActive = false;
      };
    }, [])
  );

  // When a day is selected in the calendar
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // --- Filtering appointments for the selected day ---
  const rdvForSelectedDate = appointments.filter((rdv) => {
    if (!rdv.dateTime) return false;
    const [day, month, yearAndTime] = rdv.dateTime.split('/');
    const [year] = yearAndTime.split(' ');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate === selectedDate;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* === HEADER ===*/}
      <HeaderPage title="Agenda" />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <>
          <Calendar
            style={{ marginTop: 50 }}
            onDayPress={handleDayPress}
            firstDay={1} // To make the first day Monday and not Sunday
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
          {/* === List of appointments for the day === */}
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
      {/* === FOOTER === */}
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
