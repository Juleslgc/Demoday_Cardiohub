/**
 * API Service Module
 * ---------------------------------------
 * This module centralizes all backend communication.
 * It includes a generic `apiRequest` function used for 
 * making HTTP requests and a specific helper for patient registration.
 *
 * Features:
 * - Handles JSON serialization and parsing automatically.
 * - Displays user alerts for success messages.
 * - Provides error handling with descriptive messages.
 */

import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeToken, getToken, removeToken, isTokenExpired } from '../utils/TokenStorage.js';
import LogOut from "../utils/LogOut.js";
const jwtDecode = require("jwt-decode");


// Base API endpoint
const API_URL = "https://grateful-mind-clothing-dust.trycloudflare.com/api";

// Generic API request handler
export async function apiRequest(endpoint, method = "GET", body = null, showAlert = false, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const options = {
    method,
    headers,
  };

  // Convert request body to JSON string if provided
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    // Handle HTTP errors and custom backend messages
    if (!response.ok) {
      console.log(data);
      throw new Error(data.message);
    }

    // Display success message if present
    if (showAlert && data.message) {
      Alert.alert(data.message);
    }
    return data;

  } catch (error) {
    console.error("Erreur API:", error.message);
    throw error;
  }
};

// Register a new patient account
export async function registerPatient(patientData) {
  return apiRequest("/auth/register/patient", "POST", patientData, true);
};

// Register or connection a professionnal
export async function registerPro(proData) {
	return apiRequest("/auth/register/pro", "POST", proData, false);
};

// Patient login
export async function login(loginData) {
	return apiRequest("/auth/login", "POST", loginData, false);
};

// Retrieves information from the connected patient
export async function getMe(navigation) {
    const token = await getToken();
    if (!token) throw new Error("Aucun token trouvé");

    const decoded = jwtDecode(token);
    const patientId = decoded.id;
    const proId = decoded.rpps;
    return apiRequest(`/auth/patient/${patientId}` || `/pro/${proId}`, "GET", null, false, token)
};

export async function getMePro(navigation) {
    const token = await getToken();
    if (!token) throw new Error("Aucun token trouvé");

    const decoded = jwtDecode(token);
    const proId = decoded.rpps;
    return apiRequest(`/pro/${proId}`, "GET", null, false, token)
};

export async function getPatients(navigation) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  // Checks if the token is expired
  const expired = await isTokenExpired(token);
  if (expired) {
    console.log("Token expiré, déconnexion automatique...");
    await LogOut(navigation);
    return null; // stops execution
  }

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/pro/${proId}/patients?limit=3`, "GET", null, false, token)
};

// Créer un rendez-vous
export async function createAppointment({ proId, patientId, dateTime, duration }) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  return apiRequest("/appointment", "POST", { proId, patientId, dateTime, duration }, true, token);
};

// Rechercher un patient par nom
export async function searchPatientsByName(name) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/pro/${proId}/patients?name=${name}`, "GET", null, false, token);
}
