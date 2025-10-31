import noteRepository from "../repositories/noteRepository.js";
import { Appointment } from "../models/relationModel.js";
/**
* -------------------------------------------------------------------------
* noteService.js
*
* -------------------------------------------------------------------------
* This service manages the business logic related to notes associated with appointments
* or teleconsultations in the application. 
*
* Main functionalities:
* - Creating a note for a given appointment
* - Checking for the existence of a note before creation
* - Retrieving a note by appointment
* - Updating an existing note
*
* Notes:
* - Verifies that the appointment exists before creating or retrieving a note
* - Prevents the creation of duplicate notes for the same appointment
* - Errors are thrown if required data is missing
* - Uses the `noteRepository` repository for all CRUD operations
*/

class NoteService {

  /**
  * Creates a note for an appointment
  * - Checks that the appointment exists
  * - Checks that a description is provided
  * - Checks that no note already exists for this appointment
  * - Returns the created note
  */
  async createNote(appointmentId, {description}) {
    const appointment = await Appointment.findByPk(appointmentId);
    if(!appointment) {
      throw new Error("Rendez-vous non trouvé");
    }

    if (!description) {
      throw new Error("Description manquante");
    }

    // Checks if a note already exists for this appointment
    const existingNote = await noteRepository.getNoteByAppointment(appointmentId);
    if (existingNote) {
      throw new Error("Une note existe déjà pour ce rendez-vous");
    }

    // Creates the note via the repository
    const note = await noteRepository.createNote(appointmentId, {description});

    return note;
  }

  /**
  * Retrieves a note for an appointment.
  * - If no note exists for this appointment, an error is thrown.
  */
  async getNoteByAppointment(appointmentId) {
    const note = await noteRepository.getNoteByAppointment(appointmentId);
    if (!note) {
      throw new Error("Note pour cette téléconsultation non trouvée");
    }
    return note;
  }

  /**
  * Updates an existing note.
  * - Checks that a description is provided.
  * - If the note does not exist, an error is thrown.
  * - Returns the updated note.
  */
  async updateNote(id, { description }) {
    if(!description) {
      throw new Error("Description manquante");
    }
    const updateNote = await noteRepository.updateNote(id, { description });
    if (!updateNote) {
      throw new Error("Note non trouvé");
    }

    return updateNote;
  }
}

export default new NoteService();
