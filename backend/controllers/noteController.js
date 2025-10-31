import noteService from "../services/noteService.js";
/**
* ----------------------------------------------------------------------------
* noteController.js
*
* ----------------------------------------------------------------------------
* File Purpose:
* This controller handles all HTTP requests related to **notes**
* associated with an appointment. 
*
* It acts as an intermediary between:
*   - the **front-end** (mobile or web application),
*   - and the `noteService` service layer,
*     which contains the business logic and interactions with the database. 
*
* The controller is responsible for:
*   Retrieving and validating data from the client (`req.body`, `req.params`)
*   Calling the corresponding service methods
*   Returning a clear HTTP response to the client (success or error)
*
* ----------------------------------------------------------------------------
* Error Handling:
* Each method is protected by a `try/catch` block:
*   - In case of success → returns an HTTP status:
*       • 201 → successful creation
*       • 200 → successful retrieval or update
*   - In case of error → returns a status with an explicit message:
*       • 400 → Invalid request or incorrect data
*       • 404 → Note not found for the requested appointment
*/

export default class NoteController {

  // Create a note related to an appointment.
  static async createNote(req, res){
    try {
      const { description } = req.body;
      const { appointmentId } = req.params;
      const note = await noteService.createNote(appointmentId, {description});
      res.status(201).json(note);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Retrieve a note associated with an appointment.
  static async getNoteByAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const note = await noteService.getNoteByAppointment(appointmentId);
      res.status(200).json(note);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // Update an existing note
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
