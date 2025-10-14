import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Header from "../components/HearderPro.js";
import Footer from "../components/FooterPro.js";
import { getPatients } from "../services/api.js";
import calculateAge from "../utils/CalculateAge.js";
/**
* HomePro.js
*
* Main component of the "Professional Home" screen of a medical application.
*
* Main features:
* 1. Displays recent patients retrieved from the API.
* 2. Allows you to calculate and display patient ages based on their date of birth.
* 3. Displays a loading indicator (spinner) until data is available.
* 4. Offers quick actions (teleconsultations, alerts, documents, calendar) in the form of buttons.
* 5. Includes a custom Header and Footer for consistent navigation within the application.
* 6. Manages navigation to a patient's details page or other features via `navigation.navigate`.
*
* Structure:
* - Uses React hooks (`useState`, `useEffect`) to manage states and data loading.
* - ScrollView to allow scrolling through the patient list and quick actions.
* - SafeAreaView to account for areas not covered by the screen (notch, status bar).
* - StyleSheet to format all components.
*
* Notes:
* - Icons are imported from `@expo/vector-icons` to illustrate the various actions.
* - The code is designed to be responsive and organized into clear sections: recent patients and quick actions.
*/

export default function HomePro({navigation}) {
  // Declaration of the "patients" state to store the list of patients
  const [patients, setPatients] = useState([]);
  // Declaration of the "loading" state to know if the data is still loading
  const [loading, setLoading] = useState(true);


  // useEffect allows you to execute an action when the component is displayed
  useEffect(() => {
    // Function to retrieve patients from the API
    const fetchPatients = async () => {
      try {
        const response = await getPatients(navigation); // API call
        // If the response is an array, we use it directly, otherwise we take response.patients
        setPatients(Array.isArray(response) ? response : response.patients || []);
      } catch (error) {
        console.error("Erreur lors du chargement des patients :", error);
      } finally {
        setLoading(false); // Once finished (success or error), we stop loading
      }
    };

    fetchPatients(); // We start patient recovery
  }, []); // The empty array [] means that this action is only done once on loading

  // Display part of the component
  return (
    // SafeAreaView to properly handle non-visible screen areas
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <Header/>
      {/* ScrollView allows you to scroll the page if everything does not fit on the screen */}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Patients récents</Text>
        {/* If the data is loading, a spinner is displayed */}
        {loading ? (
          <ActivityIndicator size="large" color="#042456" />
        ) : (
          // Otherwise, we display the list of patients
          <View style={styles.patients}>
            {patients.map((patient, index) => (
              <View key={patient.id} style={styles.rectangle}>
                {/* Line with the patient's icon and name */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="account-circle" size={60} color="#042456" />
                  <Text style={{ marginLeft: 10 }}>
                    <Text style={styles.h2}>{patient.firstName} {patient.lastName}</Text>{"\n"}
                    <Text style={{ color: "#042456" }}>{calculateAge(patient.birthDate)} ans</Text>
                  </Text>
                </View>
                {/* Button to view the patient's complete file */}
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={() => navigation.navigate("PatientDetail", { patientId: patient.id })}
                  >
                    <Text style={styles.buttonText}>Voir Dossier</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        {/* Button to see all patients */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button1}
            onPress={() => navigation.navigate("")}
          >
            <Text style={styles.buttonText1}>Voir tous les patients</Text>
          </TouchableOpacity>
        </View>
        {/* Quick Actions Section */}
        <Text style={styles.h1}>Actions rapides</Text>
        <View style={styles.allActions}>
          {/* Teleconsultation button */}
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('')}>
            <View style={styles.square}>
              <FontAwesome name="video-camera" size={24} color="#042456" />
              <Text style={{color: '#042456' }}>Téléconsultations</Text>
            </View >
          </TouchableOpacity>
          {/* Alert button */}
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('')}>
            <View style={styles.square}>
              <Foundation name="alert" size={24} color="#042456" />
              <Text style={{color: '#042456' }}>Alertes</Text>
            </View>
          </TouchableOpacity>
          {/* Documents Button */}
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('')}>
            <View style={styles.square}>
              <FontAwesome name="folder" size={24} color="#042456" />
              <Text style={{color: '#042456' }}>Documents</Text>
            </View>
          </TouchableOpacity>
          {/* Calendar Button */}
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('')}>
            <View style={styles.square}>
              <MaterialCommunityIcons name="notebook" size={24} color="#042456" />
              <Text style={{color: '#042456' }}>Agenda</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer/>
    </SafeAreaView>
    );
  }

// Styles for the whole screen
const styles = StyleSheet.create({
  container: { 
    backgroundColor: "#042456",
    alignContent: 'center',
    paddingVertical: 20,
    flexDirection: 'column',
    paddingBottom: 40,
  },
  patients: {
    flexDirection: 'row',
    flexWrap: 'wrap',  
    justifyContent: 'center',
    alignContent: 'center',
    gap: 5
  },
  rectangle: {
    width: 340,
    minHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 5,    
  },
  allActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',  
    justifyContent: 'center',
    alignContent: 'center',
    gap: 15
  },
  square: {
    width: 161,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    
  },
  h1: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 20
  },
  h2 : {
    color: '#042456',
    fontWeight: 'bold',
    fontSize: 16

  },
  button: {
    backgroundColor: '#042456',
    width: 320,
    minHeight: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
    
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button1: {
    backgroundColor: '#fff',
    width: 340,
    minHeight: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  buttonText1: {
    color: '#042456',
    fontWeight: 'bold',
    fontSize: 16,
  },
});