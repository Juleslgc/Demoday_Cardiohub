import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

/**
 * HeaderPage générique pour les pages internes :
 *  - Affiche une flèche de retour
 *  - Affiche un titre passé en prop
 *  
 * Usage:
 * <HeaderPage title="Téléconsultations" />
 */

export default function HeaderPage({ title }) {
  const navigation = useNavigation();

  return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={26} color="#042456" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        </View>
      </SafeAreaView>
  );
}

// Component styles
const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",   // Keeps the header fixed at the top
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 50,
    paddingHorizontal: 10,
    zIndex: 100,
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
});
