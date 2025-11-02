import { Alert } from "react-native";
import { removeToken } from "../utils/TokenStorage.js";

/**
 * LogOut Utility Function
 * ---------------------------------------
 * Handles the user logout process in a React Native application
 * using React Navigation.
 *
 * Features:
 * - Removes the locally stored authentication token via `removeToken()`
 * - Displays a success alert confirming the logout
 * - Resets the navigation stack and redirects to the "HomeScreen"
 * - Handles potential errors and provides user feedback
 *
 * Example usage:
 * import LogOut from "../utils/LogOut";
 *
 * // Inside a screen or component
 * const handleLogout = async () => {
 *   await LogOut(navigation);
 * };
 *
 * @param {object} navigation - React Navigation object used to navigate between screens.
 * @returns {Promise<void>} Resolves after logout actions are completed.
 */

export default async function LogOut(navigation) {
  try {
    // Remove locally stored authentication token
    await removeToken();

    // Notify user of successful logout
    Alert.alert("Déconnexion réussie");

    // Reset navigation stack to redirect user to HomeScreen
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
  } catch (error) {
    // Log the error for debugging and alert the user
    console.error("Logout error:", error);
    Alert.alert("Erreur lors de la déconnexion");
  }
}
