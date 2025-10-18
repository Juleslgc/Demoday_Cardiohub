import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import FooterPro from "../../components/FooterPro";
import Button from "../../components/Button";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// Functional component representing the teleconsultation area
export default function TeleconsultationProScreen({ navigation }) {
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  return (
    <SafeAreaView style={styles.container}>
      {/* === Header personnalisé === */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="#042456" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Téléconsultations</Text>
        </View>
      </View>
      {/* === Section fixe : Nouveau rendez-vous === */}
      <View style={styles.fixedAction}>
        <Button
          title="Nouveau rendez-vous"
          onPress={() => navigation.navigate('AppointmentScreen')}
          variant="full"
          icon="calendar-plus"
        />
      </View>
        {/* === Contenu défilant === */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* === Barre de filtres === */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterItem, selectedFilter === "Tous" && styles.filterItemActive,]}
              onPress={() => setSelectedFilter("Tous")}
            >
              <Text style={[styles.filterText, selectedFilter === "Tous" && styles.filterTextActive,]}>
                Tous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterItem, selectedFilter === "Aujourd'hui" && styles.filterItemActive,]}
              onPress={() => setSelectedFilter("Aujourd'hui")}
            >
              <Text style={[styles.filterText, selectedFilter === "Aujourd'hui" && styles.filterTextActive,]}>
                Aujourd'hui
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterItem, selectedFilter === "Semaine" && styles.filterItemActive,]}
              onPress={() => setSelectedFilter("Semaine")}
            >
              <Text style={[styles.filterText, selectedFilter === "Semaine" && styles.filterTextActive,]}>
                Semaine
              </Text>
            </TouchableOpacity>
          </View>
          {/* Exemple de carte de téléconsultation */}
          <View style={styles.card}>
            {/* Date section */}
            <View style={styles.rowCenter}>
              <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
              <Text style={styles.title}>16/10/2025 - 14h00</Text>
            </View>
            {/* Patient section */}
            <View style={styles.rowCenter}>
              <MaterialIcons name="account-circle" size={45} color="#042456" style={styles.iconInline} />
              <View>
                <Text style={styles.patientName}>Julie MARTIN</Text>
                <Text style={styles.patientAge}>30 ans</Text>
              </View>
            </View>
            <Button
              title="Lancer la consultation"
              //onPress={onPress}
              variant="full"
            />
          </View>
          <View style={styles.card}>
            <View style={styles.rowCenter}>
              <Entypo name="calendar" size={22} color="#042456" style={styles.iconInline} />
              <Text style={styles.title}>18/10/2025 - 09h30</Text>
            </View>
            <View style={styles.rowCenter}>
              <MaterialIcons name="account-circle" size={45} color="#042456" style={styles.iconInline} />
              <View>
                <Text style={styles.patientName}>Paul DURAND</Text>
                <Text style={styles.patientAge}>45 ans</Text>
              </View>
            </View>
            <Button
              title="Lancer la consultation"
              variant="full"
            />
          </View>
        </ScrollView>
        {/* === BARRE DE RECHERCHE === */}
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
  /** SECTION FIXE : bouton “Nouveau rendez-vous” **/
  fixedAction: {
    backgroundColor: "#F5F7FA",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  /** BARRE DE FILTRES **/
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#E6E6E6", // gris clair de fond
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 6,
    marginBottom: 18,
  },
  filterItem: {
    flex: 1,
    paddingVertical: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6E6E6", // inactif
    borderRadius: 10,
  },
  filterItemActive: {
    backgroundColor: "#fff", // blanc quand actif
  },
  filterText: {
    fontSize: 18,
    color: "#042456",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#042456",
    fontWeight: "600",
  },
  /** CONTENU SCROLLABLE **/
  scrollContainer: {
    padding: 12,
    paddingBottom: 100, // pour ne pas cacher le bas sous le footer
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,   // Vertical space between cards
    borderRadius: 7,
    padding: 10,
    position: "relative", // Allows icon positioning
  },
  iconInline: {
    marginRight: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    color: "#042456",
  },
  patientName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#042456",
    marginBottom: 2, // petit espace entre nom et âge
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