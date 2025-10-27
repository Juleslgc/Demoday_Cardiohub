import teleconsultationService from '../../services/teleconsultationService.js';
import teleconsultationRepository from '../../repositories/teleconsultationRepository.js';
import Appointment from '../../models/appointmentModel.js';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../repositories/teleconsultationRepository.js');
jest.mock('../../models/appointmentModel.js', () => ({
  findByPk: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('TeleconsultationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE TELECONSULTATION ---
  describe('createTeleconsultation', () => {
    it('creates a teleconsultation successfully', async () => {
      teleconsultationRepository.findByAppointment.mockResolvedValue(null);
      Appointment.findByPk.mockResolvedValue({ id: 1, proId: 2, patientId: 3 });
      uuidv4.mockReturnValue('1234-abcd-5678');

      const mockTeleconsultation = { jitsiLink: 'https://meet.jit.si/consultation-1234' };
      teleconsultationRepository.create.mockResolvedValue(mockTeleconsultation);

      const result = await teleconsultationService.createTeleconsultation(1);

      expect(teleconsultationRepository.findByAppointment).toHaveBeenCalledWith(1);
      expect(teleconsultationRepository.create).toHaveBeenCalledWith({
        appointmentId: 1,
        proId: 2,
        patientId: 3,
        jitsiLink: 'https://meet.jit.si/consultation-1234',
      });
      expect(result).toEqual(mockTeleconsultation);
    });

    it('returns the existing teleconsultation if already created', async () => {
      const existing = { jitsiLink: 'https://meet.jit.si/consultation-xxxx' };
      teleconsultationRepository.findByAppointment.mockResolvedValue(existing);

      const result = await teleconsultationService.createTeleconsultation(1);
      expect(result).toBe(existing);
      expect(teleconsultationRepository.create).not.toHaveBeenCalled();
    });

    it('raises an error if the appointment is not found', async () => {
      teleconsultationRepository.findByAppointment.mockResolvedValue(null);
      Appointment.findByPk.mockResolvedValue(null);

      await expect(teleconsultationService.createTeleconsultation(999)).rejects.toThrow(
        'Rendez-vous introuvable'
      );
    });

    it('raises an error if the appointment has no professional or patient', async () => {
      teleconsultationRepository.findByAppointment.mockResolvedValue(null);
      Appointment.findByPk.mockResolvedValue({ id: 1, proId: null, patientId: 5 });

      await expect(teleconsultationService.createTeleconsultation(1)).rejects.toThrow(
        'Le rendez-vous n’est pas lié à un professionnel ou un patient.'
      );
    });
  });

  // --- GET BY APPOINTMENT ---
  describe('getByAppointment', () => {
    it('returns the corresponding teleconsultation', async () => {
      const mockTeleconsultation = { id: 1, jitsiLink: 'https://meet.jit.si/consultation-abc' };
      teleconsultationRepository.findByAppointment.mockResolvedValue(mockTeleconsultation);

      const result = await teleconsultationService.getByAppointment(1);
      expect(result).toEqual(mockTeleconsultation);
      expect(teleconsultationRepository.findByAppointment).toHaveBeenCalledWith(1);
    });

    it('raises an error if no teleconsultation is found', async () => {
      teleconsultationRepository.findByAppointment.mockResolvedValue(null);

      await expect(teleconsultationService.getByAppointment(1)).rejects.toThrow(
        'Aucune téléconsultation trouvée pour ce rendez-vous.'
      );
    });
  });
});
