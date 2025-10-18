import Pro from "./proModel.js";
import Patient from "./patientModel.js";
import Appointment from "./appointmentModel.js";

// Relation plusieurs-à-plusieurs
Pro.belongsToMany(Patient, { through: "ProPatient", as: "Patients" });
Patient.belongsToMany(Pro, { through: "ProPatient", as: "Pros" });

// Relation Pro Appointment
Pro.hasMany(Appointment, { foreignKey: "proId", as: "appointments" });
Appointment.belongsTo(Pro, { foreignKey: "proId", as: "pro" });

// Relation Patient Appointment
Patient.hasMany(Appointment, { foreignKey: "patientId", as: "appointments" });
Appointment.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

export { Pro, Patient, Appointment };
