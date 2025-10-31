import teleconsultationRepository from "../repositories/teleconsultationRepository.js";
import Appointment from "../models/appointmentModel.js";
import { v4 as uuidv4 } from "uuid";
/**
* -------------------------------------------------------------------------
* teleconsultationService.js
*
* -------------------------------------------------------------------------
* This service manages the business logic for telemedicine consultations in the application. 
*
* Main functionalities:
* - Creation of a telemedicine consultation for an existing appointment
* - Retrieval of a telemedicine consultation via an appointment ID
*
* Checks and validations:
* - Verifies that the telemedicine consultation does not already exist to avoid duplicates
* - Verifies that the appointment exists and is linked to a professional and a patient
*
* Jitsi link generation:
* - Uses a UUID to create a unique link for each telemedicine consultation
* - Concatenates this link with a prefix for Jitsi
*
* Security:
* - All operations require the existence of a valid appointment
*/

class TeleconsultationService {
  // Creates a teleconsultation for an existing appointment.
  // The professional (pro) and patient are retrieved automatically from the appointment record.
  async createTeleconsultation(appointmentId) {
    // Checks if a teleconsultation already exists for this appointment
    const existing = await teleconsultationRepository.findByAppointment(appointmentId);
    if (existing) {
      console.log("Téléconsultation déjà existante, renvoi du même lien :", existing.jitsiLink);
      return existing; // Returns the same instance instead of creating a new one
    }
  
    // Verifies that the appointment exists in the database
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      throw new Error("Rendez-vous introuvable");
    }
  
    // Retrieves the professional and patient IDs associated with this appointment
    const { proId, patientId } = appointment;
  
    if (!proId || !patientId) {
      throw new Error("Le rendez-vous n’est pas lié à un professionnel ou un patient.");
    }
  
    // Generates a unique Jitsi meeting link (using only the first UUID segment for simplicity)
    const shortId = uuidv4().split("-")[0];
    const jitsiLink = `https://meet.jit.si/consultation-${shortId}`;
  
    // Creates a new teleconsultation record with all necessary data
    const teleconsultation = await teleconsultationRepository.create({
      appointmentId,
      proId,
      patientId,
      jitsiLink,
    });
  
    console.log(" Nouvelle téléconsultation créée :", teleconsultation.jitsiLink);
    return teleconsultation;
  }

  // Retrieves the teleconsultation associated with a given appointment ID.
  async getByAppointment(appointmentId) {
    const teleconsultation = await teleconsultationRepository.findByAppointment(appointmentId);
    if (!teleconsultation) throw new Error("Aucune téléconsultation trouvée pour ce rendez-vous.");
    return teleconsultation;
  }

}

export default new TeleconsultationService();
