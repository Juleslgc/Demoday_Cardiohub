import AsyncStorage from '@react-native-async-storage/async-storage';
const jwtDecode = require("jwt-decode");

/**
* tokenStorage.js
* ---------------------------------------
* This module centralizes the management of the user's authentication token
* in a React Native application using AsyncStorage.
*
* Features:
* 1. `storeToken(token)`: Stores a user token in secure local storage.
* 2. `getToken()`: Retrieves the stored token if the user is logged in.
* 3. `removeToken()`: Removes the token to log the user out.
*/

const TOKEN_KEY = 'userToken'; // Key used to store the token in AsyncStorage

// Save the token in AsyncStorage
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token); // Stores the token under the key TOKEN_KEY
    console.log('Token enregistrer');
  } catch (error) {
    console.log('Erreur sauvegarde token :', error.message);
  }
};

// Retrieve the token from AsyncStorage
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY); // Retrieves the stored token
    return token;
  } catch (error) {
    console.log('Erreur de recupération token :', error.message);
  }
};

// Delete the token from AsyncStorage
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY); // Deletes the stored token
    console.log('Token supprimer');
  } catch (error) {
    console.log('Erreur suppression token :', error.message);
  }
};

// Checks if the token is expired
export const isTokenExpired = async (token) => {
  if (!token) {
    return true; // If there is no token, it is considered "expired"
  }
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) {
      return true; // If there is no exp field, it is considered "expired"
    }

    const now = Date.now() / 1000; // We pass the date from millisecond to second
    return decoded.exp < now; // Compare if expiration has passed
  } catch (error) {
    console.log("Token invalid :", error.message);
    return true; // If the token is invalid, it is considered "expired"
  }
};
