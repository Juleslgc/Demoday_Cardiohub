import Pro from "./proModel.js";
import Patient from "./patientModel.js";

// Relation plusieurs-à-plusieurs
Pro.belongsToMany(Patient, { through: "ProPatient", as: "Patients" });
Patient.belongsToMany(Pro, { through: "ProPatient", as: "Pros" });

export { Pro, Patient };
