import { Alert } from "react-native";
import { removeToken } from "../utils/TokenStorage.js";

/**
* LogOut.js
* ---------------------------------------
* This module exports an asynchronous function that handles user logout
* in a React Native application using React Navigation.
*
* Features:
* 1. Removes the locally stored authentication token via `removeToken()`.
* 2. Displays an alert to confirm successful logout.
* 3. Resets the navigation stack to redirect the user to
* the "HomeScreen", preventing access to previous protected screens.
* 4. Handles potential errors and displays an alert if something fails.
*
* Parameters:
* - navigation: The navigation object provided by React Navigation to handle
* navigation between screens.
*/
export default async function LogOut(navigation) {
  try {
    await removeToken(); // Delete the local authentication token
    Alert.alert("Déconnexion réussie");

    // Resetting the navigation stack
    // The user is redirected to the "HomeScreen" screen
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
  } catch (error) {
    // Error handling: displays the error in the console and alerts the user
    console.error(error);
    Alert.alert("Erreur lors de la déconnexion");
  }
}