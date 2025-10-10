import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text, KeyboardAvoidingView, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Button from "../components/Button.js";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Header from "../components/HearderPro.js";
import Footer from "../components/FooterPro.js";
import { getPatients } from "../services/api.js";

export default function HomePro({navigation}) {

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(Array.isArray(response) ? response : response.patients || []);
      } catch (error) {
        console.error("Erreur lors du chargement des patients :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <Header/>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Patients récents</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#042456" />
        ) : (
          <View style={styles.patients}>
            {patients.map((patient, index) => (
              <View key={patient.id} style={styles.rectangle}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="account-circle" size={60} color="#042456" />
                  <Text style={{ marginLeft: 10 }}>
                    <Text style={styles.h2}>{patient.firstName} {patient.lastName}</Text>{"\n"}
                    <Text style={{ color: "#042456" }}>{calculateAge(patient.birthDate)} ans</Text>
                  </Text>
                </View>
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <TouchableOpacity
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
        <Text style={styles.h1}>Actions rapides</Text>
        <View style={styles.allActions}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('')}>
            <View style={styles.square}>
              <FontAwesome name="video-camera" size={24} color="#042456" />
              <Text style={{color: '#042456' }}>Téléconsultations</Text>
            </View >
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('')}>
            <View style={styles.square}>
              <Foundation name="alert" size={24} color="#042456" />
              <Text style={{color: '#042456' }}>Alertes</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('')}>
            <View style={styles.square}>
              <FontAwesome name="folder" size={24} color="#042456" />
              <Text style={{color: '#042456' }}>Documents</Text>
            </View>
          </TouchableOpacity>
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
