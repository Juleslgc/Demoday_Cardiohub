import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import HeaderPro from "../../components/HeaderPro";
import Footer from "../../components/FooterPro"

/**
* Screen: Document Space (coming soon)
* ------------------------------------------------------
* Placeholder screen for future document management. 
* Serves as a visual marker and basic structure. 
*/
export default function DocumentScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* === HEADER === */}
      <HeaderPro />
      {/* === MAIN CONTENT === */}
      <View style={styles.content}>
        <Text style={styles.title}>Espace Document</Text>
        <Text style={styles.text}>
          Future document à implémenter.
        </Text>
      </View>
      {/* === FOOTER === */}
      <Footer />
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