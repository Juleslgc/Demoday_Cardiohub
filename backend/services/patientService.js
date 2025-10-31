import bcrypt from "bcrypt";
import patientRepository from "../repositories/patientRepository.js";
import { Patient } from "../models/relationModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
/**
* -------------------------------------------------------------------------
* patientService.js
*
* -------------------------------------------------------------------------
* This service manages the business logic related to patients in the application. 
*
* Main features:
* - Creation of a new patient with complete data validation
* - Secure password hashing
* - Retrieval, updating, and deletion of patients
* - Patient authentication with JWT
* - Searching for patients by email
*
* Checks and validations:
* - First and last names are required and must contain only letters
* - Valid phone number (exactly 10 digits)
* - Unique and valid email format
* - Secure password (minimum 8 characters, uppercase, lowercase, number, special character)
* - Valid date of birth (not in the future, >= 1930)
* - Prevents the creation of duplicates
*
* Security:
* - Passwords are hashed with bcrypt
* - JWT used for authentication with a secret key stored in `.env`
*/

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;


class PatientService {

  /**
  * Creates a new patient
  * - Validates all required data
  * - Checks the validity of the password and email format
  * - Hashes the password before storing it
  */
  async registerPatient(data) {
    const hasUsefulData = data && Object.entries(data).some(
      ([key, value]) => key !== "role" && value != null && value !== "");

    if (!hasUsefulData) {
      throw new Error("Aucune information fournie dans le formulaire.");
    }
    if (!data.lastName) {
      throw new Error("Le nom est obligatoire.");
    }
    // Validation lastname and firstname
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.lastName)) {
      throw new Error("Le nom doit contenir uniquement des lettres.");
    }
    if (!data.firstName) {
      throw new Error("Le prénom est obligatoire.");
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.firstName)) {
      throw new Error("Le prénom doit contenir uniquement des lettres.");
    }
    // Phone validation: exactly 10 digits
    if(data.phone) {
      if (!/^\d{10}$/.test(data.phone)) {
        throw new Error("Le numéro de téléphone doit comporter exactement 10 chiffres.");
      }
    }
    
    // Check if the email already exists
    const existingEmail = await patientRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email déjà utilisé");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Format email non valide");
    }

    // Check the password strength
    if (
      !data.password ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(data.password)
    ) {
      throw new Error("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
    }

    // Validation birthDate
    if (!data.birthDate) {
      throw new Error("La date de naissance est obligatoire.");
    }

    const birthDate = new Date(data.birthDate);
    if (isNaN(birthDate.getTime())) {
      throw new Error("Format de date de naissance invalide.");
    }

    const year = birthDate.getFullYear();
    const today = new Date();

    if (birthDate > today) {
      throw new Error("La date de naissance ne peut pas être dans le futur.");
    }

    if (year < 1930) {
      throw new Error("La date de naissance est inférieur à 1930.");
    }

    // Hash the password (cost factor = 10 by default)
    // For healthcare apps, consider increasing to 12–14 if the infrastructure can support it
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the patient in the database
    const patient = await patientRepository.create({
      ...data,
      password: hashedPassword,
    });

    return {
      message: "Votre compte a été créé avec succès !",
      userId: patient.id,
    };
  }

  /**
  * Retrieves a patient by their ID
  */
  async getPatientById(id) {
    const patient = await patientRepository.findById(id);
    if (!patient) {
      throw new Error("Patient introuvable");
    }
    return patient;
  }

  /**
  * Updates a patient
  * - Hashes the password if provided
  */
  async updatePatient(id, data) {
    // If password is provided, hash it before saving
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await patientRepository.update(id, data);
    if (!updated) {
      throw new Error("Patient introuvable ou non modifié");
    }
    return updated;
  }

  /**
   * Delete a patient
   */
  async deletePatient(id) {
    const deleted = await patientRepository.delete(id);
    if (!deleted) {
      throw new Error("Patient introuvable");
    }
    return { message: "Patient supprimé avec succès"};
  }

  // Method to retrieve a user by email
  async getByEmail(email) {
    if (!email) {
      throw new Error("Email manquant");
    }
    // Validation of the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Format email non valide");
    }
    // Search for the user in the database
    const user = await patientRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email introuvable");
    }

    return user;
  }

  /**
  * Retrieves a patient by email
  * - Validates the email format
  */
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email et mot de passe requis");
    }
    // Search for the user in the database
    const user = await Patient.scope("withPassword").findOne({ where: { email } });
    console.log(user);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    // Password verification with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Mot de passe invalide");
    }

    // Generation of a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "3h" } // Token validity period
    );
    // Returns the user and token
    return { user, token };
  }
}

export default new PatientService();
