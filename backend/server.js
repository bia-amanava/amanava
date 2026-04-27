const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const { initDb } = require('./database/initDb');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Inicializa as tabelas do banco de dados SQLite
initDb().catch(err => {
    console.error("Falha ao inicializar o banco de dados:", err);
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Antigravity Engine Online', version: '1.0' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Upload routes
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
