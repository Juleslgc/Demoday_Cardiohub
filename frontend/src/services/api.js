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
const API_URL = "https://mas-plaza-recruitment-seeking.trycloudflare.com/api";

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
    return apiRequest(`/auth/patient/${patientId}`, "GET", null, false, token)
};

// Retrieves information from the connected pro
export async function getMePro(navigation) {
    const token = await getToken();
    if (!token) throw new Error("Aucun token trouvé");

    const decoded = jwtDecode(token);
    const proId = decoded.rpps;
    return apiRequest(`/pro/${proId}`, "GET", null, false, token)
};

// Get patient by pro
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

  return apiRequest(`/pro/${proId}/patients`, "GET", null, false, token)
};

// Created appointment by the pro
export async function createAppointment({ patientId, dateTime, duration }) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest("/appointment", "POST", { proId, patientId, dateTime, duration }, true, token);
};

// Updated appointment by the pro
export async function updatedAppointment(id, { patientId, dateTime, duration }) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/appointment/${id}`, "PUT", {proId, patientId, dateTime, duration}, true, token);
};

// Search for a patient by name
export async function searchPatientsByName(name) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/pro/${proId}/patients?name=${name}`, "GET", null, false, token);
};

// Search for all patients
export async function searchAllPatients(name) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  return apiRequest(`/patients/all?name=${name}`, "GET", null, false, token);
}

// Retrieve appointments on the professional side
export async function getAppointmentPro()  {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/appointment/pro/${proId}`, "GET", null, false, token);
};

// Retrieve appointments on the patient side
export async function getAppointmentPatient()  {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const patientId = decoded.id;

  return apiRequest(`/appointment/patient/${patientId}`, "GET", null, false, token);
};

// Adding a patient by the pro
export async function addPatient(patientId) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/add/pro/${proId}/patients/${patientId}`, "POST", null, false, token);
};

// Créer une téléconsultation (Pro uniquement)
export async function createTeleconsultation(appointmentId) {
  const token = await getToken();
  if (!token) throw new Error("Aucun token trouvé");
  return apiRequest(`/teleconsultations/${appointmentId}`, "POST", null, false, token)
};

// Récupérer une téléconsultation existante par rendez-vous
export async function getTeleconsultationByAppointment(appointmentId) {
  const token = await getToken();
  if (!token) throw new Error("Aucun token trouvé");
  return apiRequest(`/teleconsultations/${appointmentId}`, "GET", null, false, token)
};

// Create note
export async function createNote(appointmentId, description) {
  const token = await getToken();
  if (!token) throw new Error("Aucun token trouvé");

  return apiRequest(`/notes/appointment/${appointmentId}`, "POST", description, false, token);
};
