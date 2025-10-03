import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, StyleSheet, Alert, Dimensions, Platform } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from "../components/Input.js";
import Button from "../components/Button.js";
import StyledPicker from "../components/Picker.js";

export default function SimulationPsc() {
	const [lastName, setLastName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [rpps, setRpps] = useState("");
	const [institution, setInstitution] = useState("");
	const [role, setRole] = useState("Médecins");
	const [speciality, setSpeciality] = useState("");
	
	const { width, height } = Dimensions.get("window");

    const backendURL = 'https://defensive-vsnet-arrivals-link.trycloudflare.com';

    // 
	const handleSubmit = async () => {
        console.log('handleSubmit déclenché');
        const data = {
            lastName,
            firstName,
            rpps,
            institution,
            role,
            speciality
        }
		console.log(data);
		try {
            const response = await fetch(`${backendURL}/api/auth/register/pro/`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            })
            const result = await response.json();
			console.log(result.message);

  			if (!response.ok) {
    			Alert.alert('Erreur', `${result.message}`);
				return;
  			}
            Alert.alert('Succès', 'Pro enregistré !');

        } catch (error) {
            console.error('Erreur fetch :', error);
            Alert.alert('Erreur', 'Impossible de contacter le serveur.');
        }
    };

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
					<Text style={styles.h1}>Simulation</Text>
					<Text style={styles.h2}>Pro Santé Connect</Text>
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
	}

});