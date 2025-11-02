/**
 * SimulationPsc
 * ------------------------------------------------------
 * Simulates professional authentication through "Pro Santé Connect".
 *
 * Features:
 * - Allows professionals to input their personal data (name, RPPS, etc.)
 * - Validates mandatory fields (names, RPPS number, etc.)
 * - Calls the API (`registerPro`) to simulate authentication
 * - Stores the authentication token (`storeToken`)
 * - Automatically redirects to the professional home screen after success
 *
 * Technical details:
 * - Uses `Input`, `StyledPicker`, and `Button` reusable components
 * - Handles form validation with live feedback
 * - Manages loading state and form submission errors
 */

import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from "@expo/vector-icons";
import Input from "../../components/Input.js";
import Button from "../../components/Button.js";
import StyledPicker from "../../components/Picker.js";
import { registerPro } from "../../services/api.js";
import { storeToken } from '../../utils/TokenStorage.js';

/**
 * SimulationPsc Component
 * ------------------------------------------------------
 * Allows healthcare professionals to simulate a Pro Santé Connect login.
 */

export default function SimulationPsc({ navigation }) {
  // --- Local States ---
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [rpps, setRpps] = useState("");
  const [rppsError, setRppsError] = useState("");
  const [institution, setInstitution] = useState("");
  const [institutionError, setInstitutionError] = useState("");
  const [role, setRole] = useState("Médecins");
  const [speciality, setSpeciality] = useState("");
  const [specialityError, setSpecialityError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Validation Helpers ---

  // Capitalizes first letter of each word or part
  const capitalizeName = (text) => {
    return text
      .toLowerCase()
      .replace(/(?:^|[\s-])\p{L}/gu, (match) => match.toUpperCase());
  };

  // Ensures the name contains only letters, accents, or hyphens
  const isValidName = (text) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\-'\s]+$/;
    return regex.test(text);
  };

  // Ensures RPPS contains exactly 11 digits
  const isValidRpps = (text) => {
    const regex = /^[0-9]{11}$/;
    return regex.test(text);
  };

  // Checks if the overall form is valid
  const isFormValid =
    lastName.trim() !== "" &&
    !lastNameError &&
    firstName.trim() !== "" &&
    !firstNameError &&
    rpps.trim() !== "" &&
    !rppsError &&
    institution.trim() !== "" &&
    !institutionError &&
    speciality.trim() !== "" &&
    !specialityError;


  /**
   * Handles form submission.
   * ------------------------------------------------------
   * - Builds a data object from user inputs
   * - Calls the API (`registerPro`)
   * - Stores the returned token
   * - Redirects to the home screen on success
   */
  const handleSubmit = async () => {
    if (!isFormValid) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const data = {
      lastName,
      firstName,
      rpps,
      institution,
      role,
      speciality
    }
    try {
      setLoading(true);
      setError("");

      // API call for simulated registration/login
      const response = await registerPro(data);

      // Store authentication token if returned
      const token = response.token;
      if (token) {
        await storeToken(token);
      }

      // Redirect to professional home screen
      navigation.replace('HomeProScreen');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
					
          {/* --- Header with Back Arrow --- */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={26} color="#042456" />
            </TouchableOpacity>
          </View>

          {/* --- Titles --- */}
          <Text style={styles.h1}>Simulation</Text>
          <Text style={styles.h2}>Pro Santé Connect</Text>

          {/* --- Error Message --- */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* --- Form Fields --- */}
          <Input
            label="Nom"
            value={lastName}
            onChangeText={(text) => {
              const formatted = capitalizeName(text);
              setLastName(formatted);
							
              if (text && !isValidName(text)) {
                setLastNameError("Le nom doit contenir uniquement des lettres");
              } else {
                setLastNameError("");
              }
            }}
            placeholder="Dupont"
            required
            error={lastNameError}
          />

          <Input
            label="Prénom"
            value={firstName}
            onChangeText={(text) => {
              const formatted = capitalizeName(text);
              setFirstName(formatted);

              if (text && !isValidName(text)) {
                setFirstNameError("Le prénom doit contenir uniquement des lettres");
              } else {
                setFirstNameError("");
              }
            }}
            placeholder="Jean"
            required
            error={firstNameError}
          />

          <Input
            label="Identification National (RPPS)"
            value={rpps}
            onChangeText={(text) => {
              // Remove spaces and non-numeric characters
              const numeric = text.replace(/\D/g, "");
              setRpps(numeric);
					
              if (numeric && !isValidRpps(numeric)) {
                setRppsError("Le numéro RPPS doit contenir 11 chiffres");
              } else {
                setRppsError("");
              }
            }}
            placeholder="81000123456"
            required
            error={rppsError}
          />

          <Input
            label="Établissement"
            value={institution}
            onChangeText={(text) => {
              const formatted = capitalizeName(text);
              setInstitution(formatted);
            }}
            placeholder="CHU Bordeaux"
            required
          />

          <StyledPicker
            label="Rôle (sélectionner un rôle)"
            selectedValue={role}
            onValueChange={setRole}
            options={[
              { label: "Médecins", value: "Médecins" },
              { label: "Soignants", value: "Soignants" },
              { label: "Paramédicaux", value: "Paramédicaux" },
            ]}
            required
          />

          <Input
            label="Spécialité"
            value={speciality}
            onChangeText={(text) => {
              const formatted = capitalizeName(text);
              setSpeciality(formatted);
	
              if (text && !isValidName(text)) {
                setSpecialityError("La spécialité doit contenir uniquement des lettres");
              } else {
                setSpecialityError("");
              }
            }}
            placeholder="Cardiologue"
            required
            error={specialityError}
          />

          {/* --- Submit Button --- */}
          <Button
            title="Se connecter"
            onPress={handleSubmit}
            disabled={loading || !isFormValid}
            variant="full"
          />

          <Text style={styles.h3}>Simulation d'authentification Pro Santé Connect</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // === Titles ===
  h1: {
    fontWeight: 'normal', 
    color: '#042456',
    fontFamily: 'Nunito',
    fontSize: 32,
    textAlign: "center"
  },
  h2: {
    fontWeight: 'normal', 
    color: '#042456',
    fontFamily: 'Nunito',
    fontSize: 32,
    textAlign: "center",
    marginBottom: 30
  },
  h3: {
    fontWeight: 'normal', 
    color: '#042456',
    fontFamily: 'Nunito',
    fontSize: 13,
    textAlign: "center",
    marginTop: 30
  },
  // === Global Container ===
  container: { 
    width: wp(90),
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20 
  },
  // === Header with Back Button ===
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
    marginBottom: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: -10,
    padding: 5,
    zIndex: 2,
  },
  // === Error Message ===
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
