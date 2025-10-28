/**
 * This repository handles database operations related to teleconsultations.
 * It interacts directly with Sequelize models and abstracts persistence logic from services.
 *
 * Responsibilities:
 * - Create a new teleconsultation linked to an appointment
 * - Retrieve teleconsultations by appointment ID or by teleconsultation ID
 *
 * Notes:
 * - Each method returns Sequelize model instances or null if no record is found.
 * - Uses eager loading (via `include`) to fetch related Appointment, Pro, and Patient data.
 */

import Teleconsultation from "../models/teleconsultationModel.js";
import Appointment from "../models/appointmentModel.js";
import Pro from "../models/proModel.js";
import Patient from "../models/patientModel.js";

class TeleconsultationRepository {
  // Creates a new teleconsultation linked to a specific appointment
  async create({ appointmentId, proId, patientId, jitsiLink }) {
    // Inserts a new record in the teleconsultations table
    return await Teleconsultation.create({
      appointmentId,
      proId,
      patientId,
      jitsiLink,
    });
  }

  // Retrieves a teleconsultation by its associated appointment ID
  async findByAppointment(appointmentId) {
    // Searches for one teleconsultation that matches the given appointment ID
    // Includes related Appointment, Pro, and Patient data for joined context
    return await Teleconsultation.findOne({
      where: { appointmentId },
      include: [
        { model: Appointment, as: "appointment" },
        { model: Pro, as: "pro" },
        { model: Patient, as: "patient" },
      ],
    });
  }

  // Retrieves a teleconsultation by its primary key (ID)
  async findById(id) {
    // Looks up a teleconsultation by ID using Sequelize's findByPk method
    // Includes related models to return complete contextual data
    return await Teleconsultation.findByPk(id, {
      include: [
        { model: Appointment, as: "appointment" },
        { model: Pro, as: "pro" },
        { model: Patient, as: "patient" },
      ],
    });
  }
}

export default new TeleconsultationRepository();
