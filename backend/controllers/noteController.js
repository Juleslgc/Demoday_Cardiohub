import noteService from "../services/noteService.js";

export default class NoteController {

  // Create a note
  static async createNote(req, res){
    try {
      const { description } = req.body;
      const { appointmentId } = req.params;
      const note = await noteService.createNote(appointmentId, description);
      res.status(201).json(note);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Retrieve a note
  static async getNoteByAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const note = await noteService.getNoteByAppointment(appointmentId);
      res.status(200).json(note);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // Update a note
  static async updateNote(req, res){
    try {
      const { description } = req.body;
      const note = await noteService.updateNote(req.params.id, { description });
      res.status(200).json(note);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}