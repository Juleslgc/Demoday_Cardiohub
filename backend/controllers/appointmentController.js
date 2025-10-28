import appointmentService from "../services/appointmentService.js";

export default class AppointmentController {

  // Créer un rendez-vous
  static async createAppointment(req, res ){
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      console.log("Controlleur appelé");
      res.status(201).json(appointment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Récupérer les rendz-vous pour un patient ou un pro
  static async getAppointments(req, res) {
    try {
      const { patientId, proId } = req.params;
      const appointments = await appointmentService.getAppointments({ patientId, proId });
      res.status(200).json(appointments);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Annuler un rendez-vous
  static async cancelAppointment(req, res) {
    try {
      const appointment = await appointmentService.cancelAppointment(req.params.id);
      res.status(200).json(appointment);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // Mettre à jour le rendez-vous
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

  // Mettre à jour le statut d'un rendez-vous
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