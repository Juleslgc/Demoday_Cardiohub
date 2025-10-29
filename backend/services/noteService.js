import noteRepository from "../repositories/noteRepository.js";
import { Note, Appointment } from "../models/relationModel.js";

class NoteService {

  // Create a note
  async createNote(appointmentId, {description}) {
    const appointment = await Appointment.findByPk(appointmentId);
    if(!appointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    if (!description) {
      throw new Error('Description manquante');
    }

    const existingNote = await noteRepository.getNoteByAppointment(appointmentId);
    if (existingNote) {
      throw new Error('Une note existe déjà pour ce rendez-vous');
    }
    
    const note = await noteRepository.createNote(appointmentId, {description});

    return note;
  }

  // Retrieve a note by appointment
  async getNoteByAppointment(appointmentId) {
    const note = await noteRepository.getNoteByAppointment(appointmentId);
    if (!note) {
      throw new Error('Note pour cette téléconsultation non trouvée');
    }
    return note;
}

  // Update a note
  async updateNote(id, { description }) {
    if(!description) {
      throw new Error('Description manquante');
    }
    const updateNote = await noteRepository.updateNote(id, { description });
    if (!updateNote) {
      throw new Error('Note non trouvé');
    }

    return updateNote;
  }
}

export default new NoteService();