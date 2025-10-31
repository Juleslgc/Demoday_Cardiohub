import proRepository from "../repositories/proRepository.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Patient } from "../models/relationModel.js";
/**
* -------------------------------------------------------------------------
* proService.js
*
* -------------------------------------------------------------------------
* This service manages the business logic related to healthcare professionals (Pros) in the application. 
*
* Main features:
* - Creation or retrieval of a Pro with JWT generation
* - Retrieval of all Pros or a single Pro by RPPS number
* - Updating and deleting Pros
* - Managing patients associated with a Pro
* - Searching for patients by name (for a specific Pro or globally)
*
* Checks and validations:
* - RPPS number is mandatory and must be exactly 11 digits
* - Validation of text fields: first name, last name, specialty, establishment
* - Prevents duplicate patients for a Pro
*
* Security:
* - Generation of a JWT token for Pro authentication
* - Sensitive operations verify the existence of the Pro and patients before any modification
*/

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

class ProService {

  /**
  * Creates a new professional or retrieves an existing professional via RPPS
  * - Checks mandatory fields and their format
  * - Generates a JWT token for authentication
  */
  async createOrLoginPro(data) {
    // Verification of received data
    const hasUsefulData = data && Object.entries(data).some(
      ([key, value]) => key !== "role" && value != null && value !== "");

    if (!hasUsefulData) {
      throw new Error("Aucune information fournie dans le formulaire.");
    }
    // RPPS validation: exactly 11 digits
    if (!/^\d{11}$/.test(data.rpps)) {
      throw new Error("Le numéro RPPS doit comporter exactement 11 chiffres.");
    }
    // Validation of text fields: only letters and special characters allowed
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.firstName)) {
      throw new Error("Le prénom doit contenir uniquement des lettres.");
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.lastName)) {
      throw new Error("Le nom doit contenir uniquement des lettres.");
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.speciality)) {
      throw new Error("La spécialité doit contenir uniquement des lettres.");
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.institution)) {
      throw new Error("L'établissement doit contenir uniquement des lettres.");
    }
    
    // Search for an existing pro by RPPS
    let pro = await proRepository.findByRpps(data.rpps);
    // If not found, create a new pro
    if (!pro) {
      pro = await proRepository.create(data);
    }

    // Generate a JWT for the pro
    const token = jwt.sign(
      { id: pro.id, rpps: pro.rpps },
      SECRET_KEY,
      { expiresIn: "3h" }
    );
    
    return { pro, token };
  }

  /**
  * Retrieves all professionals
  */
  async getAllPros() {
    return proRepository.findAll();
  }

  /** 
  * Recovers a Pro via his RPPS 
  */
  async getProByRpps(rpps) {
    if (!rpps) {
      throw new Error("RPPS manquante.");
    }
    if (!/^\d{11}$/.test(rpps)) {
      throw new Error("Le numéro RPPS doit comporter exactement 11 chiffres.");
    }

    return proRepository.findByRpps(rpps);
  }

  /**
  * Adds a patient to a professional
  * - Checks that the patient and the professional exist
  * - Prevents duplicate additions
  */
  async addPatient(proId, patientId) {
    if (!proId || !patientId) {
      throw new Error("ID manquant");
    }
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error("Patient introuvable");
    }
    const existingPatients = await proRepository.findPatients(proId);
    const alreadyLinked = existingPatients.find(p => p.id === Number(patientId));

    if (alreadyLinked) {
      throw new Error("Ce patient est déjà associé à ce pro");
    }
    const addedPatient = await proRepository.addPatient(proId, patientId);
    if (!addedPatient) {
      throw new Error("Erreur lors de l'ajout du patient");
    }
    return addedPatient;
  }

  /**
  * Retrieves all patients associated with a professional.
  */
  async getAllPatients(proId, limit) {
    if (!proId) {
      throw new Error("Numéro d'identifiant professionnel manquant.");
    }
    
    const pro = await proRepository.findById(proId);
    if (!pro) {
      throw new Error("Professionnel introuvable.");
    }
    return proRepository.findPatients(proId, limit);
  }

  /**
  * Retrieves a specific patient for a Pro
  */
  async getPatient(proId, patientId) {
    if (!proId || !patientId) {
      throw new Error("Numéro d'identification du professionnel ou du patient manquant.");
    }

    const patient = await proRepository.findPatient(proId, patientId);
    if (!patient) {
      throw new Error("Patient introuvable.");
    }

    return patient;
  }

  /**
  * Updates a professional
  * - Prevents modification of the RPPS number
  */
  async updatePro(id, data) {
    if (!data) {
      throw new Error("Données manquantes.");
    }
    
    const pro = await proRepository.findById(id);
    if (!pro) {
      throw new Error("Professionnel introuvable.");
    }

    if (data.rpps !== pro.rpps) {
      throw new Error("Le RPPS ne peut pas être modifié.");
    }

    const updatedPro = await proRepository.update(id, data);
    if (!updatedPro) {
      throw new Error("Mise à jour impossible.");
    }

    return "Mise à jour réussie.";
  }

  /**
  * Delete a Pro
  */
  async deletePro(id) {
    const pro = await proRepository.findById(id);
    if (!pro) {
      throw new Error("Professionnel introuvable.");
    }

    const deletedPro = await proRepository.delete(id);
    if (!deletedPro) {
      throw new Error("Suppression impossible.");
    }

    return "Suppression réussie.";
  }

  /**
  * Search for patients by name for a professional
  */
  async searchPatients(proId, name) {
    if (!name) {
      throw new Error("Le nom du patient est requis.");
    }

    const patients = await proRepository.searchPatientsByName(proId, name);

    if (!patients || patients.length === 0) {
      throw new Error("Aucun patient trouvé avec ce nom.");
    }

    // Optional: format the results
    return patients.map(p => ({
      id: p.id,
      name: p.name,
      age: p.age,
      email: p.email,
    }));
  }

  /**
  * Global search for patients by name
  */
  async searchAllPatients(name) {
    if (!name) throw new Error("Le nom du patient est requis.");

    const patients = await proRepository.searchAllPatientsByName(name);

    if (!patients || patients.length === 0) {
      throw new Error("Aucun patient trouvé avec ce nom.");
    }

    return patients.map(p => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      birthDate: p.birthDate,
      alreadyLinked: p.Pros.length > 0,
    }));
  }
}

export default new ProService();
