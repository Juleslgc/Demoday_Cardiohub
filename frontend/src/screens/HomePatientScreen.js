import HeaderPatient from "../components/HeaderPatient.js";
import FooterPatient from "../components/FooterPatient.js";
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from "react-native";

export default function HomePatientScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderPatient />
      <FooterPatient />
    </SafeAreaView>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 70, // space to not hide the content under the header
  },
});