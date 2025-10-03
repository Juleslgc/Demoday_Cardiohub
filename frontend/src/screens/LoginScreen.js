import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, StyleSheet, Alert, Dimensions, Platform, Image, ViewStyle, View, TouchableOpacity } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from "../components/Input.js";
import Button from "../components/Button.js";

export default function LoginScreen() {

  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { width, height } = Dimensions.get("window");

	const backendURL = 'http://10.5.3.240:3000';

	const handleSubmit = async () => {

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
						<Button title="Se connecter" onPress={handleSubmit} variant="full" />
						<Text style={styles.h3}>Mot de passe oublié ?</Text>
						<SeparatorOr/>
						
						<Button title="Connexion via Pro Santé Connect" variant="outline" icon="shield-check" />
						<Separator/>
						<Text style={styles.h3}>Pas encore de compte ?</Text>
						<TouchableOpacity onPress={() => navigation.navigate('SimulationPsc')}>
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

	const separatorStyle: ViewStyle = {
		height: 1,
		width: '100%',
		backgroundColor: '#042456',
		marginTop: 30
	};

	const Separator = () => <View style={separatorStyle}/>;

	const separatorOr: ViewStyle = {
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