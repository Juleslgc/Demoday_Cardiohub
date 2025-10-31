import BaseRepository from "./baseRepository.js";
import { Appointment, Note } from "../models/relationModel.js";
/**
* -------------------------------------------------------------------------
* noteRepository.js
*
* -------------------------------------------------------------------------
* This file manages all interactions between the `Note` model and the database. 
* It centralizes the business logic related to notes associated with appointments: creation,
* retrieval, and updating. 
*
* By inheriting from `BaseRepository`, this class benefits from generic CRUD operations,
* while also adding methods specific to note management. 
*
* Each note is linked to an appointment via `appointmentId`, ensuring that
* medical or follow-up information is always associated with a specific consultation. 
*/

class NoteRepository extends BaseRepository{
  constructor() {
    super(Note);
  }

  // Create a new note for an appointment
  async createNote(appointmentId, {description}) {
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) return null;

    const note = await Note.create({
      appointmentId: appointment.id,
      description: description
    });

    return note;
  }

  // Retrieve the note associated with an appointment
  async getNoteByAppointment(appointmentId) {
    const note = await Note.findOne({
      where: { appointmentId },
    });
    if (!note) return null;

    return note;
  }

  // Update the content of an existing note
  async updateNote(id, { description }) {
    const note = await Note.findByPk(id);
    if (!note) return null;

    if (description) note.description = description;

    await note.save();
    return note;
  }
}

export default new NoteRepository();
