/**
 * CalendarScreen
 * ------------------------------------------------------
 * This screen allows healthcare professionals to view their appointments
 * on a calendar. It highlights the days with scheduled appointments
 * and displays the list of appointments for the selected date.
 *
 * Features:
 * - Calendar view with marked days
 * - French localization for months and weekdays
 * - Automatic loading of professional's appointments
 * - Daily appointment list with patient names and time slots
 * - Visual feedback when loading or when no appointments exist
 */

import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import HeaderPage from '../../components/HeaderPage';
import Footer from '../../components/FooterPro';
import { getAppointmentPro } from "../../services/api";

/**
 * CalendarScreen Component
 * ------------------------------------------------------
 * Displays a calendar with the professional’s appointments,
 * highlighting the days with existing events and showing the
 * corresponding appointment list for the selected date.
 */

export default function CalendarScreen() {
  // --- Local States ---
  const today = new Date().toISOString().split('T')[0]; // Today's date
  const [appointments, setAppointments] = useState([]); // All fecth appointments
  const [markedDates, setMarkedDates] = useState({
    [today]: { selected: true, selectedColor: "#00BFFF"},
  }); // Calendar marked dates
  const [selectedDate, setSelectedDate] = useState(today); // Currently selected date
  const [loading, setLoading] = useState(false);

  // --- Calendar localization (French) ---
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
   * Fetches appointments each time the screen comes into focus.
   * Updates both the appointment list and the marked dates on the calendar.
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
            
            // Convert appointments to calendar markings
            const marks = {};
            data.forEach((rdv) => {
              const rawDate = rdv.dateTime;
              if (rawDate) {
                // Convert French date to ISO format (YYYY-MM-DD)
                const [day, month, yearAndTime] = rawDate.split('/');
                const [year] = yearAndTime.split(' ');
                const formattedDate = `${year}-${month}-${day}`;
                marks[formattedDate] = { marked: true, dotColor: '#00BFFF' };
              }
            });

            // Set marked dates and keep today's date selected
            setMarkedDates({
              ...marks,
              [today]: { ...(marks[today] || {}), selected: true, selectedColor: "#00BFFF" },
            });

            // Forces today's date as selected
            setSelectedDate(today);
          }
        } catch (err) {
          console.error('Erreur lors du chargement des rendez-vous :', err);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchAppointment();

      // Cleanup to avoid state updates if unmounted
      return () => {
        isActive = false;
      };
    }, [])
  );

  /**
   * Handles user selection on the calendar.
   * Updates the highlighted day and selected date.
   */
  const handleDayPress = (day) => {
    const ds = day.dateString;
    setSelectedDate(ds);

    setMarkedDates((prev) => {
      // Removes "selected" from all previous days
      const cleared = Object.fromEntries(
        Object.entries(prev).map(([date, props]) => [
          date,
          { ...props, selected: false },
        ])
      );

      // Highlight the newly selected day
      return {
        ...cleared,
        [ds]: { ...(cleared[ds] || {}), selected: true, selectedColor: "#00BFFF" },
      };
    });
  };

  /**
   * Filters the list of appointments for the selected date.
   */
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

      {/* --- Loading indicator or calendar content --- */}
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <>
          <View style={styles.content}>
            {/* --- Calendar section --- */}
            <Calendar
              current={selectedDate}
              style={{ marginTop: 50 }}
              onDayPress={handleDayPress}
              firstDay={1} // Monday as first day of the week
              theme={{
                calendarBackground: '#042456',
                dayTextColor: '#fff',
                monthTextColor: '#fff',
                arrowColor: '#fff',
                todayTextColor: '#00BFFF',
              }}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  ...(markedDates[selectedDate] || {}),
                  selected: true,
                  selectedColor: '#00BFFF',
                  dotColor: '#fff',
                },
              }}
            />

            {/* --- Appointment list for the selected day --- */}
            {selectedDate && (
              <View style={styles.appointmentsContainer}>
                <Text style={styles.dateTitle}>Rendez-vous du {selectedDate ? selectedDate.split('-').reverse().join('/') : ''}</Text>
                
                {rdvForSelectedDate.length > 0 ? (
                  <FlatList
                    data={rdvForSelectedDate}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                      const [datePart, timePart] = item.dateTime.split(' '); // ["28/10/2025", "14:00:00"]
                      const time = timePart ? timePart.slice(0, 5) : ''; // "14:00"
                      
                      return (
                        <Text style={styles.appointmentItem}>
                          <Text style={{ fontWeight: "600" }}>{time}</Text>
                          {` : ${item.patient?.firstName} ${item.patient?.lastName}`}
                        </Text>
                      );
                    }}
                  />
                ) : (
                  <Text style={{ color: '#042456', fontSize: 16 }}>Aucun rendez-vous</Text>
                )}
              </View>
            )}
          </View>
        </>
      )}

      <Footer />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Root container with dark blue background
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#042456',
  },
  // Main content section containing calendar and list
  content: {
    flex: 1,
    paddingBottom: 10,
  },
  // Container for the daily appointment list
  appointmentsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 70,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  // Title showing the selected date
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#042456",
  },
  // Each appointment line (time + patient name)
  appointmentItem: {
    fontSize: 16,
    marginBottom: 5,
    color: "#042456",
  },
});
