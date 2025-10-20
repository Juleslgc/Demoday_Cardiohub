/**
 * Teleconsultation Routes
 * --------------------------------------------
 * Gère les endpoints relatifs aux téléconsultations :
 *  - Création d’une téléconsultation par un professionnel
 *  - Récupération sécurisée d’une téléconsultation
 *  - Mise à jour du statut (en cours, terminée, annulée)
 */

import { Router } from "express";
import authenticate from "../middleware/authMiddleware.js";
import teleconsultationController from "../controllers/teleconsultationController.js";

const router = Router();

// Crée une téléconsultation (pro uniquement)
router.post("/:appointmentId", authenticate, teleconsultationController.createTeleconsultation);

// Récupère une téléconsultation (patient ou pro concerné)
router.get("/:appointmentId", authenticate, teleconsultationController.getByAppointment);

// Met à jour le statut (ex: "in_progress", "completed", "cancelled")
router.put("/:id/status", authenticate, teleconsultationController.updateStatus);

export default router;
