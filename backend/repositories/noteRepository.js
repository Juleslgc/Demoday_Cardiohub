import BaseRepository from "./baseRepository.js";
import { Appointment, Note } from "../models/relationModel.js";

class NoteRepository extends BaseRepository{
  constructor() {
    super(Note);
  }

  // Create a note
  async createNote(appointmentId, {description}) {
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) return null;

    const note = await Note.create({
      appointmentId: appointment.id,
      description: description
    });

    return note;
  }

  // Retrieve a note by appointment
  async getNoteByAppointment(appointmentId) {
    const note = await Note.findOne({
      where: { appointmentId },
    });
    if (!note) return null;

    return note;
  }

  // Update the note
  async updateNote(id, { description }) {
    const note = await Note.findByPk(id);
    if (!note) return null;

    if (description) note.description = description;

    await note.save();
    return note;
  }
}

export default new NoteRepository();