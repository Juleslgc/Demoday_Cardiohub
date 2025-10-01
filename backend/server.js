import './config/initDB.js';
import express from 'express';
import proRoutes from './routes/proRoute.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', proRoutes);


// 404 for routes not found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route introuvable.' });
});

// 500 for server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur.' });
});

// Server start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
