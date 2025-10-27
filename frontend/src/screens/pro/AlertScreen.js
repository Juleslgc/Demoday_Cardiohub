/**
* Screen: Alert Area
* ------------------------------------------------------
* Temporary screen serving as a placeholder for the future
* management of alert messages (emergencies, notifications, etc.). 
*/

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import HeaderPage from "../../components/HeaderPage";

// Functional component representing the pro alert screen
export default function AlertScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPage title="Alerte" />

      <View style={styles.content}>
        <Text style={styles.title}>Espace Alerte</Text>
        <Text style={styles.text}>
          Futur message d'alerte à implémenter.
        </Text>
      </View>

    </SafeAreaView>
    );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA", // Light background for readability
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#042456",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#042456",
  },
});
