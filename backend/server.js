const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const materiRoutes = require('./routes/materi');
const latihanRoutes = require('./routes/latihan');
const aktivitasRoutes = require('./routes/aktivitas');

app.use('/api/auth', authRoutes);
app.use('/api/materi', materiRoutes);
app.use('/api/latihan', latihanRoutes);
app.use('/api/aktivitas', aktivitasRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API Backend Numerasi berjalan dengan baik!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
