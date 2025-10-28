import jwt from 'jsonwebtoken';
import proRepository from '../../repositories/proRepository.js';
import { Patient } from '../../models/relationModel.js';
import proService from '../../services/proService.js';

jest.mock('jsonwebtoken');
jest.mock('../../repositories/proRepository.js');
jest.mock('../../models/relationModel.js', () => ({
  Patient: { findByPk: jest.fn() }
}));

describe('ProService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE OR LOGIN PRO ---
  describe('createOrLoginPro', () => {
    it('creates a new pro and generates a token', async () => {
      const data = {
        rpps: '12345678901',
        firstName: 'Alice',
        lastName: 'Dupont',
        speciality: 'Cardiologie',
        institution: 'Hopital'
      };

      proRepository.findByRpps.mockResolvedValue(null);
      proRepository.create.mockResolvedValue({ id: 1, rpps: '12345678901' });
      jwt.sign.mockReturnValue('fakeToken');

      const result = await proService.createOrLoginPro(data);

      expect(proRepository.findByRpps).toHaveBeenCalledWith('12345678901');
      expect(proRepository.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({
        pro: { id: 1, rpps: '12345678901' },
        token: 'fakeToken'
      });
    });

    it('returns an existing pro and generates a token', async () => {
      const existing = { id: 2, rpps: '12345678901' };
      proRepository.findByRpps.mockResolvedValue(existing);
      jwt.sign.mockReturnValue('token');

      const data = {
        rpps: '12345678901',
        firstName: 'Bob',
        lastName: 'Martin',
        speciality: 'Pediatrie',
        institution: 'Clinique'
      };

      const result = await proService.createOrLoginPro(data);

      expect(proRepository.create).not.toHaveBeenCalled();
      expect(result.pro).toBe(existing);
      expect(result.token).toBe('token');
    });

    it('throws an error if RPPS is invalid', async () => {
      await expect(proService.createOrLoginPro({ rpps: '1234' }))
        .rejects.toThrow('Le numéro RPPS doit comporter exactement 11 chiffres.');
    });
  });

  // --- GET ALL PROS ---
  describe('getAllPros', () => {
    it('returns a list of pros', async () => {
      proRepository.findAll.mockResolvedValue([{ id: 1 }]);
      const result = await proService.getAllPros();
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  // --- GET PRO BY RPPS ---
  describe('getProByRpps', () => {
    it('returns the found pro', async () => {
      proRepository.findByRpps.mockResolvedValue({ id: 1 });
      const result = await proService.getProByRpps('12345678901');
      expect(result).toEqual({ id: 1 });
    });

    it('throws an error if RPPS is missing', async () => {
      await expect(proService.getProByRpps('')).rejects.toThrow('RPPS manquante.');
    });
  });

  // --- ADD PATIENT ---
  describe('addPatient', () => {
    it('adds a patient successfully', async () => {
      Patient.findByPk.mockResolvedValue({ id: 10 });
      proRepository.findPatients.mockResolvedValue([]);
      proRepository.addPatient.mockResolvedValue({ id: 10 });

      const result = await proService.addPatient(1, 10);

      expect(result).toEqual({ id: 10 });
      expect(proRepository.addPatient).toHaveBeenCalledWith(1, 10);
    });

    it('throws an error if the patient is already linked', async () => {
      Patient.findByPk.mockResolvedValue({ id: 10 });
      proRepository.findPatients.mockResolvedValue([{ id: 10 }]);
      await expect(proService.addPatient(1, 10))
        .rejects.toThrow('Ce patient est déjà associé à ce pro');
    });

    it('throws an error if the patient does not exist', async () => {
      Patient.findByPk.mockResolvedValue(null);
      await expect(proService.addPatient(1, 99))
        .rejects.toThrow('Patient introuvable');
    });
  });

  // --- GET ALL PATIENTS ---
  describe('getAllPatients', () => {
    it('returns the list of patients', async () => {
      proRepository.findById.mockResolvedValue({ id: 1 });
      proRepository.findPatients.mockResolvedValue([{ id: 1, name: 'Alice' }]);
      const result = await proService.getAllPatients(1);
      expect(result).toEqual([{ id: 1, name: 'Alice' }]);
    });

    it('throws an error if pro not found', async () => {
      proRepository.findById.mockResolvedValue(null);
      await expect(proService.getAllPatients(1))
        .rejects.toThrow('Professionnel introuvable.');
    });
  });

  // --- GET PATIENT ---
  describe('getPatient', () => {
    it('returns the patient if found', async () => {
      proRepository.findPatient.mockResolvedValue({ id: 2 });
      const result = await proService.getPatient(1, 2);
      expect(result).toEqual({ id: 2 });
    });

    it('throws an error if patient not found', async () => {
      proRepository.findPatient.mockResolvedValue(null);
      await expect(proService.getPatient(1, 2))
        .rejects.toThrow('Patient introuvable.');
    });
  });

  // --- UPDATE PRO ---
  describe('updatePro', () => {
    it('updates a pro successfully', async () => {
      const pro = { id: 1, rpps: '12345678901' };
      proRepository.findById.mockResolvedValue(pro);
      proRepository.update.mockResolvedValue(true);
      const result = await proService.updatePro(1, { rpps: '12345678901', firstName: 'New' });
      expect(result).toBe('Mise à jour réussie.');
    });

    it('throws an error if RPPS is changed', async () => {
      proRepository.findById.mockResolvedValue({ id: 1, rpps: '123' });
      await expect(proService.updatePro(1, { rpps: '456' }))
        .rejects.toThrow('Le RPPS ne peut pas être modifié.');
    });

    it('throws an error if pro not found', async () => {
      proRepository.findById.mockResolvedValue(null);
      await expect(proService.updatePro(1, {}))
        .rejects.toThrow('Professionnel introuvable.');
    });
  });

  // --- DELETE PRO ---
  describe('deletePro', () => {
    it('deletes a pro', async () => {
      proRepository.findById.mockResolvedValue({ id: 1 });
      proRepository.delete.mockResolvedValue(true);
      const result = await proService.deletePro(1);
      expect(result).toBe('Suppression réussie.');
    });

    it('throws an error if pro not found', async () => {
      proRepository.findById.mockResolvedValue(null);
      await expect(proService.deletePro(1))
        .rejects.toThrow('Professionnel introuvable.');
    });
  });

  // --- SEARCH PATIENTS ---
  describe('searchPatients', () => {
    it('returns formatted patients', async () => {
      proRepository.searchPatientsByName.mockResolvedValue([
        { id: 1, name: 'Alice', age: 40, email: 'a@a.com' }
      ]);
      const result = await proService.searchPatients(1, 'Alice');
      expect(result).toEqual([
        { id: 1, name: 'Alice', age: 40, email: 'a@a.com' }
      ]);
    });

    it('throws an error if no patient found', async () => {
      proRepository.searchPatientsByName.mockResolvedValue([]);
      await expect(proService.searchPatients(1, 'X'))
        .rejects.toThrow('Aucun patient trouvé avec ce nom.');
    });
  });

  // --- SEARCH ALL PATIENTS ---
  describe('searchAllPatients', () => {
    it('returns all formatted patients', async () => {
      proRepository.searchAllPatientsByName.mockResolvedValue([
        {
          id: 1,
          firstName: 'Bob',
          lastName: 'Martin',
          email: 'b@b.com',
          birthDate: '1980-01-01',
          Pros: [{}],
        },
      ]);
      const result = await proService.searchAllPatients('Bob');
      expect(result).toEqual([
        {
          id: 1,
          firstName: 'Bob',
          lastName: 'Martin',
          email: 'b@b.com',
          birthDate: '1980-01-01',
          alreadyLinked: true,
        },
      ]);
    });

    it('throws an error if no patient found', async () => {
      proRepository.searchAllPatientsByName.mockResolvedValue([]);
      await expect(proService.searchAllPatients('X'))
        .rejects.toThrow('Aucun patient trouvé avec ce nom.');
    });
  });
});
