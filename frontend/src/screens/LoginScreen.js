import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, StyleSheet, Alert, Dimensions, Platform, Image, View, TouchableOpacity } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from "../components/Input.js";
import Button from "../components/Button.js";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { width, height } = Dimensions.get("window");
	const backendURL = 'https://url-passing-architectural-those.trycloudflare.com';

	const handleSubmitLogin = async () => {
		const data = { email, password }
		console.log(data);
		try {
			const response = await fetch(`${backendURL}/api/users/login`,{
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data),
			})
			const result = await response.json();
			console.log(result.message);
						
			if (!response.ok) {
				Alert.alert(result.message);
				return;
			}
			navigation.replace('HomePatient');

		} catch (error) {
			console.error('Erreur fetch :', error.message);
			Alert.alert('Erreur', 'Impossible de contacter le serveur.');
		}
	};

	return (
			<SafeAreaView style={{ flex: 1 }}>
				<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
					<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
						<Image source={require("../assets/LogoCardioHub.png")}
						style={styles.logo}
						resizeMode='contain'/>
						<Text style={styles.h1}>Connexion</Text>
						<Input
							label="Email"
							value={email}
							onChangeText={setEmail}
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
						<SeparatorOr/>
						
						<Button title="Connexion via Pro Santé Connect" onPress={() => navigation.replace('SimulationPsc')}variant="outline" icon="shield-check" />
						<Separator/>
						<Text style={styles.h3}>Pas encore de compte ?</Text>
						<TouchableOpacity onPress={() => navigation.replace('Register')}>
        					<Text style={styles.h3}>Créer un compte</Text>
      					</TouchableOpacity>
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
			marginTop: 30
		},
		container: { 
				width: wp(90),
        alignSelf: 'center',
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20 
		},
		logo: {
    width: 290,
    height: 140,
    alignSelf: "center",
  },
	
	});

	const separatorStyle = {
		height: 1,
		width: '100%',
		backgroundColor: '#042456',
		marginTop: 30
	};

	const Separator = () => <View style={separatorStyle}/>;

	const separatorOr = {
		height: 1,
		flex: 1,
		backgroundColor: '#042456'
	};

	function SeparatorOr() {
		return(
		<SafeAreaView>
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				<View style={separatorOr} />
				<Text style={{color: '#042456', fontFamily: 'Nunito'}}> ou </Text>
				<View style={separatorOr} />
			</View>
		</SafeAreaView>
	)};
