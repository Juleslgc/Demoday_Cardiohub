/**
 * LoginScreen
 * ------------------------------------------------------
 * Authentication screen for CardioHub users.
 *
 * Features:
 * - Allows users to log in with their email and password
 * - Option to log in via “Pro Santé Connect” simulation
 * - Validates fields and performs authentication via API (`login`)
 * - Stores authentication token securely (AsyncStorage + TokenStorage)
 * - Redirects users to their respective home screens upon success
 * 
 * Future Enhancements:
 * - Implement “Mot de passe oublié” (password reset) feature
 *   → This will require an additional API endpoint
 *   → Expected flow: user enters email → receives reset link → sets new password
 *
 * Technical details:
 * - Uses `KeyboardAvoidingView` for mobile-friendly input handling
 * - `SafeAreaView` ensures content is visible on notched screens
 * - Uses reusable UI components for consistency (Button, Input, Separator)
 */

import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, StyleSheet, Alert, Platform, Image, View, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from "../components/Input.js";
import Button from "../components/Button.js";
import Separator from "../components/Separator.js";
import SeparatorWithText from "../components/SeparatorWithText.js";
import { login } from "../services/api.js";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeToken } from '../utils/TokenStorage.js';

/**
 * LoginScreen Component
 * ------------------------------------------------------
 * Renders the login interface and handles authentication.
 */

export default function LoginScreen({ navigation }) {
// --- Local states ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handles user login attempt.
   * ------------------------------------------------------
   * - Validates credentials
   * - Calls the backend API (`login`)
   * - Stores the received authentication token
   * - Redirects to the appropriate home screen upon success
   */
  const handleSubmitLogin = async () => {
    const data = { email, password }
    try {
      const response = await login(data);
      console.log(response.message);

      // Store token securely
      await AsyncStorage.setItem("token", response.token);
      const token = response.token;
      if (token) {
        await storeToken(token);
      }
			
      // Redirection after successful login
      navigation.replace('HomePatientScreen');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
					
          {/* === HEADER WITH BACK ARROW + LOGO === */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={26} color="#042456" />
            </TouchableOpacity>

            <Image
              source={require("../assets/LogoCardioHub.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* === MAIN TITLE === */}
          <Text style={styles.h1}>Connexion</Text>

          {/* === FORM INPUTS === */}
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
            placeholder="example@email.com"
            required
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••••••••"
            required
          />

          {/* === LOGIN BUTTON === */}
          <Button
            title="Se connecter"
            onPress={handleSubmitLogin}
            variant="full"
          />

          {/* Placeholder for future password recovery feature */}
          <Text style={styles.h3}>Mot de passe oublié ?</Text>

          <SeparatorWithText/>

          {/* === PSC ALTERNATIVE LOGIN === */}
          <Button
            title="Connexion via Pro Santé Connect"
            onPress={() => navigation.replace('SimulationPsc')}
            variant="outline"
            icon="shield-check"
          />
					
          <Separator/>

          {/* === REGISTRATION REDIRECT === */}
          <Text style={styles.h3}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={() => navigation.replace('HomeScreen')}>
            <Text style={styles.link}>Créer un compte</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Component Styles
const styles = StyleSheet.create({
  /** --- TITLES --- **/
  h1: {
    fontWeight: 'normal', 
    color: '#042456',
    fontFamily: 'Nunito',
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20
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
    marginTop: 20
  },
  /** --- LAYOUT --- **/
  container: { 
    width: wp(90),
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20 
  },
  /** --- HEADER + LOGO --- **/
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
  logo: {
    width: 290,
    height: 140,
    alignSelf: "center",
    marginTop: 10,
  },
  /** --- LINKS --- **/
  link: {
    color: "#042456",
    textDecorationLine: "underline",
    fontWeight: "bold",
    textAlign: 'center',
    fontSize: 13,
  },
});
