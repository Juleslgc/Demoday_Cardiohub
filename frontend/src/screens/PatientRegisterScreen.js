/**
 * PatientRegisterScreen Component
 * ---------------------------------------
 * This screen allows patients to create a new account.
 * It includes input validation, error handling, and data formatting
 * before sending registration information to the backend.
 *
 * Navigation:
 * - React Navigation prop used to navigate between screens.
 *
 * Features:
 * - Responsive design and keyboard-safe layout.
 * - Form validation (password match, valid date, required fields).
 * - Integration with backend via `registerPatient()` service.
 * - Checkbox linking to Terms and Privacy Policy screens.
 */

import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Checkbox from "expo-checkbox";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button.js";
import Input from "../components/Input.js";
import { registerPatient } from "../services/api.js"; // Backend API call handler

export default function PatientRegisterScreen({ navigation }) {
  // Local states to store form values
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  // Check if the form is valid
  const isFormValid = 
    lastName.trim() !== "" &&
    firstName.trim() !== "" &&
    birthDate.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword &&
    accepted;

  // Validate that the date is correct and not in the future
  const isValidDate = (dateStr) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Months start from 0
    const year = parseInt(match[3], 10);

    const date = new Date(year, month, day);
    const today = new Date();

    // Ensure the date exists (e.g., not 31/02/2024)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return false;
    }

    // Ensure the date is not in the future
    return date <= today;
  };
  
  // Handle account creation
  const handleRegister = async () => {
    if (!isFormValid) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Check that the passwords match
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Check the date of birth format
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      setError("La date de naissance doit être au format JJ/MM/AAAA");
      return;
    }

    if (!isValidDate(birthDate)) {
      setError("La date de naissance est invalide ou dans le futur.");
      return;
    }

    // Convert date format to YYYY-MM-DD for backend compatibility
    const [day, month, year] = birthDate.split("/");
    const formattedDate = `${year}-${month}-${day}`;

    try {
      setLoading(true);
      setError("");

      const response = await registerPatient({
        lastName,
        firstName,
        birthDate: formattedDate,
        email,
        password,
        address,
        phone,
      });
    
      // Redirect to login screen after success
      navigation.navigate("LoginScreen"); 
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Ensures scroll works correctly when the keyboard opens 
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex:1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../assets/LogoCardioHub.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Créer un compte</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Input
          label="Nom"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Martin"
          required
        />
        <Input
          label="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Alice"
          required
        />
        <Input
          label="Date de naissance"
          value={birthDate}
          onChangeText={(text) => {
            // Remove non-numeric characters
            let formatted = text.replace(/\D/g, "");
            // Automatically insert slashes
            if (formatted.length > 2 && formatted.length <= 4) {
              formatted = formatted.replace(/(\d{2})(\d{1,2})/, "$1/$2");
            } else if (formatted.length > 4) {
              formatted = formatted.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
            }
            // Limit to 10 characters (DD/MM/YYYY)
            if (formatted.length > 10) formatted = formatted.slice(0, 10);
            setBirthDate(formatted);
          }}
          placeholder="jj/mm/aaaa"
          required
          error={
            birthDate &&
            !isValidDate(birthDate)
            ? "Date invalide"
            : ""
          }
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="exemple@mail.com"
          required
        />
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Votre mot de passe"
          required
        />
        <Input
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Votre mot de passe"
          required
          error={password !== confirmPassword && confirmPassword.length > 0 
            ? "Les mots de passe ne correspondent pas" 
            : ""}
        />
        <Input
          label="Adresse"
          value={address}
          onChangeText={setAddress}
          placeholder="12 rue de l'Avenir 75000 Paris"
        />
        <Input
          label="Téléphone"
          value={phone}
          onChangeText={setPhone}
          placeholder="00 00 00 00 00"
        />

        {/* Checkbox for terms and privacy policy */}
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxLabelContainer}>
            <Checkbox
              value={accepted}
              onValueChange={setAccepted}
              color={accepted ? "#042456" : undefined}
            />
            <Text style={styles.star}>*</Text>
          </View>

          <Text style={styles.checkboxText}>
            J'accepte les{" "}
            <Text 
              style={styles.link} 
              onPress={() => navigation.navigate("ConditionsScreen")}
            >
              conditions d'utilisation
            </Text>{" "}
            et la{" "}
            <Text 
              style={styles.link} 
              onPress={() => navigation.navigate("ConfidentialiteScreen")}
            >
              politique de confidentialité
            </Text>.
          </Text>
        </View>

        {/* Submit button */}
        <Button
          title={loading ? "Création..." : "Créer mon compte"}
          onPress={handleRegister}
          disabled={loading || !isFormValid}
          variant="full"
          icon="account-plus"
        />

        {/* Link to login screen */}
        <View style={styles.footerText}>
          <Text style={{ color: "#042456" }}>Déjà inscrit ? </Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("LoginScreen")}
            >
             Se connecter
            </Text>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: {
    width: wp(90),    // 90% of screen width
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  logo: {
    width: 290,
    height: 130,
    alignSelf: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "normal",
    fontFamily: "Nunito",
    color: "#042456",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    color: "#042456",
    marginLeft: 10,
    fontFamily: "Nunito",
  },
  link: {
    color: "#042456",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  footerText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 40,
  },
  star: {
    color: "red",
    marginLeft: 4,
    fontWeight: "bold",
    marginTop: -10,
  },
  checkboxLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
