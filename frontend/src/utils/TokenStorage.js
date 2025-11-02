import AsyncStorage from '@react-native-async-storage/async-storage';
const jwtDecode = require("jwt-decode");

/**
 * TokenStorage Utility Module
 * ---------------------------------------
 * Centralizes the management of the user's authentication token
 * in a React Native application using AsyncStorage.
 *
 * Features:
 * - `storeToken(token)`: Saves a user token in local storage
 * - `getToken()`: Retrieves the stored authentication token
 * - `removeToken()`: Deletes the token to log the user out
 * - `isTokenExpired(token)`: Checks whether a JWT token has expired
 *
 * Example usage:
 * import { storeToken, getToken, removeToken, isTokenExpired } from "../utils/TokenStorage";
 *
 * await storeToken(authToken);
 * const token = await getToken();
 * const expired = await isTokenExpired(token);
 * if (expired) await removeToken();
 */

const TOKEN_KEY = 'userToken'; // Key used to store the token in AsyncStorage

/**
 * Stores a JWT authentication token in AsyncStorage.
 *
 * @param {string} token - The JWT token to store.
 * @returns {Promise<void>} Resolves when the token is successfully saved.
 */
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.log('Error saving token:', error.message);
  }
};

/**
 * Retrieves the stored authentication token from AsyncStorage.
 *
 * @returns {Promise<string | null>} The stored JWT token, or null if none exists.
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.log('Error retrieving token:', error.message);
  }
};

/**
 * Removes the authentication token from AsyncStorage.
 *
 * @returns {Promise<void>} Resolves when the token is successfully removed.
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.log('Error removing token:', error.message);
  }
};

/**
 * Checks whether a JWT token has expired.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<boolean>} Returns `true` if the token is missing, invalid, or expired.
 */
export const isTokenExpired = async (token) => {
  if (!token) {
    return true; // No token = expired by default
  }

  try {
    const decoded = jwtDecode(token);

    // If no expiration field is found, consider the token expired
    if (!decoded.exp) {
      return true;
    }

    const now = Date.now() / 1000; // Convert milliseconds to seconds
    return decoded.exp < now; // Compare expiration time with current time
  } catch (error) {
    console.log("Invalid token:", error.message);
    return true; // Invalid tokens are treated as expired
  }
};
