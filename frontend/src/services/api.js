/**
 * API Service Module
 * ------------------------------------------------------
 * Centralized module managing all backend communications
 * for the CardioHub application.
 *
 * Core responsibilities:
 * - Abstract HTTP requests through a unified `apiRequest()` function
 * - Handle authentication via JWT tokens (retrieved from TokenStorage)
 * - Provide reusable service functions for Patients and Professionals
 * - Manage token validation and automatic logout on expiration
 *
 * Features:
 * - Automatic JSON serialization and parsing
 * - Global error handling with human-readable messages
 * - Optional success alerts on completion (`showAlert` flag)
 * - Supports CRUD operations for patients, appointments, notes, and teleconsultations
 *
 * Technical details:
 * - Base URL: defined via `API_URL`
 * - Uses `fetch` for network communication
 * - Relies on helper utilities in `/utils` (TokenStorage, LogOut)
 */

import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeToken, getToken, removeToken, isTokenExpired } from '../utils/TokenStorage.js';
import LogOut from "../utils/LogOut.js";
const jwtDecode = require("jwt-decode");

// ------------------------------------------------------
// Base API Endpoint
// ------------------------------------------------------
const API_URL = "https://thereby-aqua-adam-glasgow.trycloudflare.com/api";

// ------------------------------------------------------
// Generic API Request Handler
// ------------------------------------------------------
/**
 * Performs a generic HTTP request to the backend.
 *
 * @param {string} endpoint - API endpoint (e.g., "/auth/login")
 * @param {string} [method="GET"] - HTTP method
 * @param {object|null} [body=null] - Optional payload (will be JSON.stringified)
 * @param {boolean} [showAlert=false] - Display success message if available
 * @param {string|null} [token=null] - Optional JWT token for Authorization
 * @returns {Promise<object>} - JSON response from the server
 */

export async function apiRequest(endpoint, method = "GET", body = null, showAlert = false, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  const options = { method, headers };
  // Convert request body to JSON string if provided
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    // Handle HTTP errors and custom backend messages
    if (!response.ok) {
      throw new Error(data.message);
    }

    // Display success message if present
    if (showAlert && data.message) {
      Alert.alert(data.message);
    }
    return data;

  } catch (error) {
    throw error;
  }
};

// ------------------------------------------------------
// AUTHENTICATION
// ------------------------------------------------------

/** Registers a new patient */
export async function registerPatient(patientData) {
  return apiRequest("/auth/register/patient", "POST", patientData, true);
};

/** Registers or connects a professional */
export async function registerPro(proData) {
  return apiRequest("/auth/register/pro", "POST", proData, false);
};

/** Logs in a patient */
export async function login(loginData) {
  return apiRequest("/auth/login", "POST", loginData, false);
};

/**
 * Retrieves connected patient information
 * (decodes JWT to get user ID)
 */
export async function getMe(navigation) {
  const token = await getToken();
  if (!token) throw new Error("Aucun token trouvé");

  const decoded = jwtDecode(token);
  const patientId = decoded.id;
  const proId = decoded.rpps;
  return apiRequest(`/auth/patient/${patientId}`, "GET", null, false, token)
};

/**
 * Retrieves connected professional information
 * (decodes JWT to get RPPS ID)
 */
export async function getMePro(navigation) {
  const token = await getToken();
  if (!token) throw new Error("Aucun token trouvé");

  const decoded = jwtDecode(token);
  const proId = decoded.rpps;
  return apiRequest(`/pro/${proId}`, "GET", null, false, token)
};

// ------------------------------------------------------
// PATIENTS
// ------------------------------------------------------

/**
 * Retrieves all patients linked to the logged-in professional.
 * Automatically logs out if token is expired.
 */
export async function getPatients(navigation) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  // Checks if the token is expired
  const expired = await isTokenExpired(token);
  if (expired) {
    console.log("Token expiré, déconnexion automatique...");
    await LogOut(navigation);
    return null;
  }

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/pro/${proId}/patients`, "GET", null, false, token)
};

/** Searches for a patient by name (Pro side) */
export async function searchPatientsByName(name) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/pro/${proId}/patients?name=${name}`, "GET", null, false, token);
};

/** Searches across all registered patients */
export async function searchAllPatients(name) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  return apiRequest(`/patients/all?name=${name}`, "GET", null, false, token);
}

/** Adds a patient to a professional's list */
export async function addPatient(patientId) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/add/pro/${proId}/patients/${patientId}`, "POST", null, false, token);
};

// ------------------------------------------------------
// APPOINTMENTS
// ------------------------------------------------------

/** Creates a new appointment for a professional */
export async function createAppointment({ patientId, dateTime, duration }) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest("/appointment", "POST", { proId, patientId, dateTime, duration }, true, token);
};

/** Updates an existing appointment */
export async function updatedAppointment(id, { patientId, dateTime, duration }) {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/appointment/${id}`, "PUT", {proId, patientId, dateTime, duration}, true, token);
};

/** Retrieves appointments for a professional */
export async function getAppointmentPro()  {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const proId = decoded.id;

  return apiRequest(`/appointment/pro/${proId}`, "GET", null, false, token);
};

/** Retrieves appointments for a patient */
export async function getAppointmentPatient()  {
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  const decoded = jwtDecode(token);
  const patientId = decoded.id;

  return apiRequest(`/appointment/patient/${patientId}`, "GET", null, false, token);
};

// ------------------------------------------------------
// TELECONSULTATIONS
// ------------------------------------------------------

/** Creates a new teleconsultation (Pro only) */
export async function createTeleconsultation(appointmentId) {
  const token = await getToken();
  if (!token) throw new Error("Aucun token trouvé");

  return apiRequest(`/teleconsultations/${appointmentId}`, "POST", null, false, token)
};

/** Retrieves an existing teleconsultation by appointment */
export async function getTeleconsultationByAppointment(appointmentId) {
  const token = await getToken();
  if (!token) throw new Error("Aucun token trouvé");

  return apiRequest(`/teleconsultations/${appointmentId}`, "GET", null, false, token)
};

// ------------------------------------------------------
// NOTES
// ------------------------------------------------------

/** Creates a note for a specific appointment */
export async function createNote(appointmentId, description) {
  const token = await getToken();
  if (!token) throw new Error("Aucun token trouvé");

  return apiRequest(`/notes/appointment/${appointmentId}`, "POST", description, false, token);
};

/** Retrieves a note linked to an appointment */
export async function getNoteByAppointment(appointmentId) {
  const token = await getToken();
  if (!token) throw new Error("Aucun token trouvé");

  return apiRequest(`/notes/appointment/${appointmentId}`, "GET", null, false, token);
};
