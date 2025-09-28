import './config/initDB.js';
import express from 'express';
import proRoutes from './routes/proRoute.js';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/pros', proRoutes);


// 404 for routes not found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// 500 for server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
