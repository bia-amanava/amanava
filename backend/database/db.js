const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the SQLite database (creates the file if it doesn't exist)
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

module.exports = db;
