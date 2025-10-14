import React, { use, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from "@expo/vector-icons";
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

	// Capitalize the first letter of each word or part separated by a space or hyphen
  const capitalizeName = (text) => {
    return text
      .toLowerCase()
      .replace(/(?:^|[\s-])\p{L}/gu, (match) => match.toUpperCase());
  };

	// Checks that the string contains only letters (including accented and hyphens)
  const isValidName = (text) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\-'\s]+$/;
    return regex.test(text);
  };

	// Check that the rpps contains exactly 11 digits
  const isValidRpps = (text) => {
    const regex = /^[0-9]{11}$/;
    return regex.test(text);
  };

	// Check if the form is valid
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
* Function called when the form is submitted
* ----------------------------------------------------
* - Constructs the `data` object from the fields
* - Sends the request via the `registerPro` function
* - If successful → redirects to the "HomeProScreen" page
* - If error → displays an alert
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
    } finally {
			setLoading(false);
		}
  };

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
					<View style={styles.header}>
						<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
							<MaterialIcons name="arrow-back" size={26} color="#042456" />
						</TouchableOpacity>
					</View>

					<Text style={styles.h1}>Simulation</Text>
					<Text style={styles.h2}>Pro Santé Connect</Text>
					{error ? <Text style={styles.error}>{error}</Text> : null}
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
	header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,  // space between the arrow and the title
    marginBottom: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: -10,
    padding: 5,
    zIndex: 2, // ensures that the button remains clickable
  },
	error: {
		color: "red",
		marginBottom: 10,
		textAlign: "center",
	}

});