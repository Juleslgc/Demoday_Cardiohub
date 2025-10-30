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
* User Login Screen
* --------------------------------------------
* This screen allows the user to:
* - enter their email address and password
* - log in via the backend (API call)
* - or use the alternative login via "Pro Santé Connect"
*
* If successful, they are redirected to their home page.
*/
export default function LoginScreen({ navigation }) {

  // Local states to store form fields
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

  /**
* handleSubmitLogin()
* --------------------
* Function triggered when the "Login" button is pressed.
* - Checks the fields
* - Calls the `login(data)` API service
* - If the login is successful: redirect to `HomePatientScreen`
* - Otherwise: displays an error alert
*/
	const handleSubmitLogin = async () => {
		const data = { email, password }
		try {
			const response = await login(data);
			console.log(response.message);

			// Save the token to local storage
			await AsyncStorage.setItem("token", response.token);
      // Retrieve the token to store it
      const token = response.token;
      if (token) {
        await storeToken(token);
      }
			
      // Redirection after login
			navigation.replace('HomePatientScreen');
		} catch (error) {
      // Display a user error
			Alert.alert('Erreur', error.message);
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

						<Image
							source={require("../assets/LogoCardioHub.png")}
							style={styles.logo}
							resizeMode="contain"
						/>
					</View>

					<Text style={styles.h1}>Connexion</Text>
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
					<Button title="Se connecter" onPress={handleSubmitLogin} variant="full" />
					<Text style={styles.h3}>Mot de passe oublié ?</Text>
					<SeparatorWithText/>
					
					<Button title="Connexion via Pro Santé Connect" onPress={() => navigation.replace('SimulationPsc')}variant="outline" icon="shield-check" />
					<Separator/>
					<Text style={styles.h3}>Pas encore de compte ?</Text>
					<TouchableOpacity onPress={() => navigation.replace('HomeScreen')}>
								<Text style={styles.link}>Créer un compte</Text>
							</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
		);
	}

// Component styles
const styles = StyleSheet.create({
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
    paddingTop: 15,  // space between the arrow and the logo
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
	logo: {
		width: 290,
		height: 140,
		alignSelf: "center",
		marginTop: 10,
	},
	link: {
		color: "#042456",
		textDecorationLine: "underline",
		fontWeight: "bold",
		textAlign: 'center',
		fontSize: 13
	}
});