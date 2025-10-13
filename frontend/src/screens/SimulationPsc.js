import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, StyleSheet, Alert, Dimensions, Platform } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from "../components/Input.js";
import Button from "../components/Button.js";
import StyledPicker from "../components/Picker.js";
import { registerPro } from "../services/api.js";
import { storeToken } from '../utils/TokenStorage.js';

/**
* Login simulation screen via "Pro Santé Connect"
* --------------------------------------------------------
* This screen allows a healthcare professional to:
* - Enter their information (last name, first name, RPPS, etc.)
* - Simulate a login (authentication) using a button
*
* Main features:
* - Validation of mandatory fields (visual via Input)
* - Send data to a backend API (`registerPro`)
* - Automatic navigation to the Pro homepage after success
*/
export default function SimulationPsc({ navigation }) {
  // Local states to manage form fields
	const [lastName, setLastName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [rpps, setRpps] = useState("");
	const [institution, setInstitution] = useState("");
	const [role, setRole] = useState("Médecins");
	const [speciality, setSpeciality] = useState("");
  const [error, setError] = useState("");

  /**
* Function called when the form is submitted
* ----------------------------------------------------
* - Constructs the `data` object from the fields
* - Sends the request via the `registerPro` function
* - If successful → redirects to the "HomeProScreen" page
* - If error → displays an alert
*/
	const handleSubmit = async () => {
        const data = {
            lastName,
            firstName,
            rpps,
            institution,
            role,
            speciality
        }
		try {
      // Call the registration/connection service
			const response = await registerPro(data);
			console.log(response.message);
      // Retrieve the token to store it
      const token = response.token;
      console.log('TOKEN :', token);
      if (token) {
        await storeToken(token);
        console.log('Token enregistrer');
      }

      // Redirect to the main pros page
      navigation.replace('HomeProScreen');
    } catch (error) {
      // Displays a user error message
      setError(error.message);
    }
  };

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
					<Text style={styles.h1}>Simulation</Text>
					<Text style={styles.h2}>Pro Santé Connect</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
					<Input
						label="Nom"
						value={lastName}
						onChangeText={setLastName}
						placeholder="Dupont"
						required
					/>
					<Input
						label="Prénom"
						value={firstName}
						onChangeText={setFirstName}
						placeholder="Jean"
						required
					/>
					<Input
						label="Identification National (RPPS)"
						value={rpps}
						onChangeText={setRpps}
						placeholder="81000123456"
						required
					/>
					<Input
						label="Établissement"
						value={institution}
						onChangeText={setInstitution}
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
						onChangeText={setSpeciality}
						placeholder="Cardiologue"
						required
					/>
					<Button title="Se connecter" onPress={handleSubmit} variant="full" />
					<Text style={styles.h3}>Simulation d'authentification Pro Santé Connect</Text>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

// Component styles
const styles = StyleSheet.create({
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
	container: { 
		width: wp(90),
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20 
	},
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  }

});