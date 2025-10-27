import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import patientRepository from '../../repositories/patientRepository.js';
import { Patient } from '../../models/relationModel.js';
import patientService from '../../services/patientService.js';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../repositories/patientRepository.js');
jest.mock('../../models/relationModel.js', () => ({
  Patient: { scope: jest.fn().mockReturnThis(), findOne: jest.fn() }
}));

describe('PatientService', () => {

  // --- REGISTER PATIENT ---
  describe('registerPatient', () => {
    it('doit créer un patient avec un mot de passe hashé', async () => {
      const data = {
        firstName: 'Alice',
        lastName: 'Dupont',
        email: 'alice@example.com',
        password: '123456',
        birthDate: '1990-01-01'
      };
      patientRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      patientRepository.create.mockResolvedValue({ id: 1, ...data });

      const result = await patientService.registerPatient(data);

      expect(patientRepository.findByEmail).toHaveBeenCalledWith('alice@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(patientRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        message: expect.any(String),
        userId: 1
      });
    });

    it('doit lever une erreur si le mail existe déjà', async () => {
      const data = { email: 'test@example.com', firstName: 'A', lastName: 'B', password: '123', birthDate: '1990-01-01' };
      patientRepository.findByEmail.mockResolvedValue({ id: 1 });
      await expect(patientService.registerPatient(data)).rejects.toThrow('Email déjà utilisé');
    });

    it('doit lever une erreur si la date de naissance est dans le futur', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = { firstName: 'A', lastName: 'B', email: 'a@a.com', password: '123', birthDate: futureDate.toISOString() };
      patientRepository.findByEmail.mockResolvedValue(null);
      await expect(patientService.registerPatient(data)).rejects.toThrow('La date de naissance ne peut pas être dans le futur.');
    });
  });

  // --- GET PATIENT BY ID ---
  describe('getPatientById', () => {
    it('retourne un patient si trouvé', async () => {
      patientRepository.findById.mockResolvedValue({ id: 1, name: 'Alice' });
      const result = await patientService.getPatientById(1);
      expect(result).toEqual({ id: 1, name: 'Alice' });
    });

    it('lève une erreur si patient introuvable', async () => {
      patientRepository.findById.mockResolvedValue(null);
      await expect(patientService.getPatientById(999)).rejects.toThrow('Patient introuvable');
    });
  });

  // --- UPDATE PATIENT ---
  describe('updatePatient', () => {
    it('hash le mot de passe si fourni', async () => {
      bcrypt.hash.mockResolvedValue('hashed');
      patientRepository.update.mockResolvedValue({ id: 1 });
      const result = await patientService.updatePatient(1, { password: 'newpass' });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
      expect(result).toEqual({ id: 1 });
    });

    it('lève une erreur si patient non modifié', async () => {
      patientRepository.update.mockResolvedValue(null);
      await expect(patientService.updatePatient(1, {})).rejects.toThrow('Patient introuvable ou non modifié');
    });
  });

  // --- DELETE PATIENT ---
  describe('deletePatient', () => {
    it('supprime un patient', async () => {
      patientRepository.delete.mockResolvedValue(true);
      const result = await patientService.deletePatient(1);
      expect(result).toEqual({ message: 'Patient supprimé avec succès' });
    });

    it('lève une erreur si patient introuvable', async () => {
      patientRepository.delete.mockResolvedValue(false);
      await expect(patientService.deletePatient(999)).rejects.toThrow('Patient introuvable');
    });
  });

  // --- GET BY EMAIL ---
  describe('getByEmail', () => {
    it('retourne le patient trouvé', async () => {
      patientRepository.findByEmail.mockResolvedValue({ id: 1, email: 'test@test.com' });
      const result = await patientService.getByEmail('test@test.com');
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });

    it('lève une erreur si email manquant', async () => {
      await expect(patientService.getByEmail('')).rejects.toThrow('Email manquant');
    });

    it('lève une erreur si format email invalide', async () => {
      await expect(patientService.getByEmail('invalid')).rejects.toThrow('Format email non valide');
    });

    it('lève une erreur si patient non trouvé', async () => {
      patientRepository.findByEmail.mockResolvedValue(null);
      await expect(patientService.getByEmail('a@b.com')).rejects.toThrow('Email introuvable');
    });
  });

  // --- LOGIN ---
  describe('login', () => {
    it('retourne user et token si succès', async () => {
      const user = { id: 1, email: 'a@b.com', password: 'hashed' };
      Patient.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fakeToken');

      const result = await patientService.login('a@b.com', '123');
      expect(result).toEqual({ user, token: 'fakeToken' });
    });

    it('lève une erreur si utilisateur non trouvé', async () => {
      Patient.findOne.mockResolvedValue(null);
      await expect(patientService.login('a@b.com', '123')).rejects.toThrow('Utilisateur non trouvé');
    });

    it('lève une erreur si mot de passe invalide', async () => {
      Patient.findOne.mockResolvedValue({ id: 1, email: 'a@b.com', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);
      await expect(patientService.login('a@b.com', 'wrong')).rejects.toThrow('Mot de passe invalide');
    });
  });
});
