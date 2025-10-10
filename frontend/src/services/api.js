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

// Base API endpoint
const API_URL = "https://irrigation-researchers-liz-sponsored.trycloudflare.com/api";

// Generic API request handler
export async function apiRequest(endpoint, method = "GET", body = null, showAlert = false) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
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
	return apiRequest("/auth/register/pro", "POST", proData, true);
};

// Patient login
export async function login(loginData) {
	return apiRequest("/auth/login", "POST", loginData, true);
};

export async function getPatients() {
  const proId = '6f654911-85eb-432e-8749-8b2144575844';
  return apiRequest(`/pro/${proId}/patients?limit=3`, "GET")
};