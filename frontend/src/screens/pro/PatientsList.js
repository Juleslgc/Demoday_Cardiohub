import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import HeaderPage from "../../components/HeaderPage";
import FooterPro from "../../components/FooterPro";
import Button from "../../components/Button";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function PatientList({ navigation }) {
  const [searchPatient, setSearchPatient] = useState("");
  
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Patients" />

      {/* Section fixe : Ajouter un patient */}
      <View style={styles.fixedAction}>
        <Button
          title="Ajouter un patient"
          // onPress={...}
          variant="full"
          icon="plus"
        />
      </View>

      {/* Scrollable main content area */}
      <View style={styles.scrollArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate("")}>
            <View style={styles.cardContent}>
              <MaterialIcons name="account-circle" size={45} color="#042456" />
              
              <View style={styles.cardTextContainer}>
                <Text style={styles.patientName}>Julie Martin</Text>
                <Text style={styles.patientAge}>30 ans</Text>
              </View>

              <MaterialCommunityIcons name="greater-than" size={24} color="#042456" />
            </View>
          </TouchableOpacity>

        </ScrollView>
        </View>

      {/* Barre de recherche */}
      <View style={styles.searchSection}>
        <FontAwesome name="search" size={20} color="#042456" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un patient..."
          placeholderTextColor="#666"
          value={searchPatient}
          onChangeText={setSearchPatient}
        />
        </View>

      <FooterPro />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#042456",
  },
  scrollArea: {
    flex: 1,
    marginTop: 10,
    marginBottom: 80,
  },

  /** SECTION FIXE : bouton “Nouveau rendez-vous” **/
  fixedAction: {
    backgroundColor: "#F5F7FA",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 50,
  },

  card: {
    backgroundColor: "#fff",
    marginBottom: 20,   // Vertical space between cards
    borderRadius: 7,
    padding: 10,
    margin: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#042456",
  },
  patientAge: {
    fontSize: 16,
    color: "#042456",
  },

  /** BARRE DE RECHERCHE **/
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 80,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#042456",
  },

});