import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const SECRET_KEY = process.env.JWT_SECRET;

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Aucun jeton n\'a été fourni' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Jeton invalide' });
  }
}
