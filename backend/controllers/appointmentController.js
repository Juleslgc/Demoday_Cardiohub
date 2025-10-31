import appointmentService from "../services/appointmentService.js";
/**
*
* appointmentController.js
*
* -----------------------------------------------------------------------------
* File Purpose:
* This controller handles all HTTP requests related to appointments
* in the application. 
*
* It acts as an interface between:
*   - the client (mobile or web), which sends the HTTP requests,
*   - and the `appointmentService` service layer,
*     which contains the business logic and interactions with the database. 
*
* The controller does not handle any complex business logic:
*   - It retrieves and validates the request data (req.body, req.params)
*   - It calls the appropriate service method
*   - It returns an appropriate HTTP response with the correct status code
*
* -----------------------------------------------------------------------------
* Error Handling:
* Each method is protected by a try/catch block:
*   - On success → JSON response with status code 200 (or 201 for creation)
*   - On error → JSON response with an explicit message:
*       • 400 → Invalid data or incorrect request
*       • 404 → Resource not found
*/

export default class AppointmentController {

  // Create an appointment
  static async createAppointment(req, res ){
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      res.status(201).json(appointment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Retrieve appointments for a patient or a professional
  static async getAppointments(req, res) {
    try {
      const { patientId, proId } = req.params;
      const appointments = await appointmentService.getAppointments({ patientId, proId });
      res.status(200).json(appointments);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Cancel an appointment
  static async cancelAppointment(req, res) {
    try {
      const appointment = await appointmentService.cancelAppointment(req.params.id);
      res.status(200).json(appointment);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // Update an appointment
  static async updateAppointment(req, res) {
    try {
      const { dateTime, duration, patientId, proId } = req.body;
      const appointment = await appointmentService.updateAppointment(req.params.id, {
        dateTime: dateTime ? new Date(dateTime) : undefined,
        duration,
        patientId,
        proId,
      });
      res.json(appointment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Update the status of an appointment
  static async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const appointment = await appointmentService.updateStatus(req.params.id, status);
      res.json(appointment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
