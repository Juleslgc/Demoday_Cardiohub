/**
 * HomeProScreen
 * ------------------------------------------------------
 * Main screen for healthcare professionals.
 * Displays a summary of recent patients and provides
 * quick navigation to the main professional features.
 *
 * Features:
 * - Fetches and displays recent patients from the API.
 * - Shows patient ages calculated from birth dates.
 * - Includes loading indicators while fetching data.
 * - Provides quick access to actions: teleconsultations, alerts, documents, and calendar.
 * - Integrates custom header and footer components for consistent navigation.
 *
 * Technical notes:
 * - Uses `useFocusEffect` to refresh data when the screen becomes active.
 * - Responsive layout based on device width.
 * - Organized structure separating patient list and quick actions.
 */

import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HeaderPro from '../../components/HeaderPro.js';
import FooterPro from "../../components/FooterPro.js";
import { getPatients } from "../../services/api.js";
import calculateAge from "../../utils/CalculateAge.js";
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * HomePro Component
 * ------------------------------------------------------
 * Displays a dashboard for professionals with:
 * - a list of recent patients
 * - quick action buttons for core features
 */

export default function HomePro({navigation}) {
  // --- Local States ---
  const [patients, setPatients] = useState([]); // All patients fetched from API
  const [loading, setLoading] = useState(true);

  /**
   * Fetches patient data when the screen is in focus.
   * Ensures data refresh after navigation events.
   */
  useFocusEffect(
    useCallback(() => {
      const fetchPatients = async () => {
        try {
          const response = await getPatients(navigation);
          // If the response is an array, we use it directly, otherwise we take response.patients
          setPatients(Array.isArray(response) ? response : response.patients || []);
        } catch (error) {
          console.error("Erreur lors du chargement des patients :", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPatients();
    }, [])
  );

  // --- Sort and limit to most recent patients ---
  const recentPatients = patients
    .slice() // to avoid modifying the original array
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <SafeAreaView style={{backgroundColor: '#042456', flex: 1}}>
      <HeaderPro/>

      {/* --- Scrollable Content --- */}
      <View style={styles.scrollArea}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* === RECENT PATIENTS SECTION === */}
          <Text style={styles.h1}>Patients récents</Text>

          {/* --- Loading spinner --- */}
          {loading ? (
            <ActivityIndicator size="large" color="#042456" />
          ) : (
            // --- List of recent patients ---
            <View style={styles.patients}>
              {recentPatients.map((patient) => (
                <View key={patient.id} style={styles.rectangle}>
                  {/* --- Patient name and age --- */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons name="account-circle" size={53} color="#042456" />
                    <Text style={{ marginLeft: 10 }}>
                      <Text style={styles.h2}>{patient.firstName} {patient.lastName}</Text>{"\n"}
                      <Text style={{ color: "#042456", fontSize: 16 }}>{calculateAge(patient.birthDate)} ans</Text>
                    </Text>
                  </View>

                  {/* --- Access patient details button --- */}
                  <View style={{ alignItems: "center", marginTop: 5 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.button}
                      onPress={() => navigation.navigate("PatientFileScreen", { patient })}
                    >
                      <Text style={styles.buttonText}>Voir Dossier</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* --- View All Patients Button --- */}
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button1}
              onPress={() => navigation.navigate("PatientList")}
            >
              <Text style={styles.buttonText1}>Voir tous les patients</Text>
            </TouchableOpacity>
          </View>

          {/* === QUICK ACTIONS SECTION === */}
          <Text style={[styles.h1, { marginTop: 20 }]}>Actions rapides</Text>
          
          <View style={styles.allActions}>
            {/* --- Teleconsultations --- */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('TeleconsultationProScreen')}
            >
              <View style={styles.square}>
                <FontAwesome5 name="video" size={32} color="#042456" />
                <Text style={{color: '#042456' }}>Téléconsultations</Text>
              </View >
            </TouchableOpacity>

            {/* --- Alerts --- */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AlertScreen')}
            >
              <View style={styles.square}>
                <Foundation name="alert" size={32} color="#042456" />
                <Text style={{color: '#042456' }}>Alertes</Text>
              </View>
            </TouchableOpacity>

            {/* --- Documents --- */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DocumentScreen')}
            >
              <View style={styles.square}>
                <FontAwesome name="folder" size={32} color="#042456" />
                <Text style={{color: '#042456' }}>Documents</Text>
              </View>
            </TouchableOpacity>

            {/* --- Calendar --- */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CalendarScreen')}
            >
              <View style={styles.square}>
                <MaterialCommunityIcons name="notebook" size={32} color="#042456" />
                <Text style={{color: '#042456' }}>Agenda</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <FooterPro />
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Scrollable area margins to fit header/footer
  scrollArea: {
    flex: 1,
    marginTop: 70,
    marginBottom: 80,
  },
  // Scroll content container
  container: {
    alignContent: 'center',
    flexDirection: 'column',
  },
  // Wrapper for recent patients
  patients: {
    flexDirection: 'row',
    flexWrap: 'wrap',  
    justifyContent: 'center',
    alignContent: 'center',
    gap: 5,
  },
  // Individual patient card
  rectangle: {
    width: width * 0.9,
    minHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 6,
    paddingHorizontal: 7,
  },
  // Container for all quick-action buttons
  allActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',  
    justifyContent: 'center',
    alignContent: 'center',
    gap: 15,
  },
  // Quick action button (square format)
  square: {
    width: width * 0.45,
    height: width * 0.28,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  // Section title text
  h1: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 20
  },
  // Patient name
  h2 : {
    color: '#042456',
    fontWeight: '600',
    fontSize: 17,
  },
  // "View File" button styling
  button: {
    backgroundColor: '#042456',
    width: width * 0.84,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 7,
  },
  // "View All Patients" button styling
  button1: {
    backgroundColor: '#F5F7FA',
    width: width * 0.9,
    minHeight: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText1: {
    color: '#042456',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 10,
  },
});
