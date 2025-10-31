/**
 * -------------------------------------------------------------------------
 * patientRepository.js
 *
 * -------------------------------------------------------------------------
 * - Extends the generic BaseRepository to add patient-specific queries.
 * - Uses the Patient Sequelize model.
 *
 * Responsibilities:
 * - Inherit standard CRUD operations from BaseRepository.
 * - Provide patient-specific data access methods (e.g., find by email).
 * - Expose secure queries with or without sensitive data like password.
 *
 * Notes:
 * - `findByEmail` retrieves a patient by email without password.
 * - `findByEmailWithPassword` explicitly includes the hashed password (useful for login).
 */

import BaseRepository from "./baseRepository.js";
import Patient from "../models/patientModel.js";
import { sequelize } from "../config/db.js";
import { fn, col } from "sequelize";

class PatientRepository extends BaseRepository {
  constructor() {
    super(Patient); // Pass the Patient model to the BaseRepository
  }
  
  // Find a patient by email (excludes password by default)
  async findByEmail(email) {
    return await Patient.findOne({ 
      where: sequelize.where(
        fn("LOWER", col("email")),    // converts the column to lowercase
        email.toLowerCase().trim()    // converts the input to lowercase and removes spaces
      )
    });
  }

  // Find a patient by email including the hashed password (for authentication purposes)
  async findByEmailWithPassword(email) {
    return await Patient.scope("withPassword").findOne({ where: { email } });
  }
}

export default new PatientRepository();