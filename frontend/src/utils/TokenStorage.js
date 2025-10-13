import AsyncStorage from '@react-native-async-storage/async-storage';

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