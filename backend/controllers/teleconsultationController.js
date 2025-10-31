/**
 * ----------------------------------------------------------------------------
 * teleconsultationController.js
 * 
 * ----------------------------------------------------------------------------
 * This controller handles HTTP requests related to teleconsultations.
 * It delegates business logic to the teleconsultationService and returns appropriate HTTP responses.
 *
 * Responsibilities:
 * - Create a new teleconsultation linked to an appointment
 * - Retrieve a teleconsultation by appointment ID
 *
 * Notes:
 * - Each method uses try/catch to handle service-layer errors.
 * - Returns JSON responses with appropriate HTTP status codes.
 */

import teleconsultationService from "../services/teleconsultationService.js";

export default class TeleconsultationController {
  // Create a new teleconsultation from an appointment ID
  static async createTeleconsultation(req, res) {
    try {
      // Extract the appointment ID from the URL parameters
      const { appointmentId } = req.params;

      // Calls the service to create a teleconsultation linked to this appointment
      const teleconsultation = await teleconsultationService.createTeleconsultation(appointmentId);
      
      res.status(201).json(teleconsultation);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Retrieves a teleconsultation associated with a specific appointment
  static async getByAppointment(req, res) {
    try {
      // Retrieves the appointment ID from the URL parameters
      const { appointmentId } = req.params;

      // Calls the service to get the corresponding teleconsultation
      const teleconsultation = await teleconsultationService.getByAppointment(appointmentId);
      
      res.status(200).json(teleconsultation);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
}
