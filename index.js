require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); // Dodanie obsługi MySQL
const app = express();
const PORT = 3000; // Ustaw port 3000

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Połączenie z bazą danych MySQL
const db = mysql.createConnection({
    host: 'localhost',    // Zmień na swoją konfigurację
    user: 'root',         // Użytkownik bazy danych
    password: '',         // Hasło bazy danych
    database: 'to_do_app' // Nazwa bazy danych
});

db.connect(err => {
    if (err) {
        console.error('Nie udało się połączyć z bazą danych:', err);
        process.exit(1);
    }
    console.log('Połączono z bazą danych MySQL');
});

// Testowy endpoint
app.get('/', (req, res) => {
    res.send('Server is running on port 3000!');
});

// Endpointy API
// Pobierz wszystkie zadania
app.get('/api/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania zadań:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else {
            res.json(results);
        }
    });
});

// Dodaj nowe zadanie
app.post('/api/tasks', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO tasks (name, completed) VALUES (?, false)';
    db.query(query, [name], (err, result) => {
        if (err) {
            console.error('Błąd podczas dodawania zadania:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else {
            res.json({ id: result.insertId, name, completed: false });
        }
    });
});

// Aktualizuj status zadania
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const query = 'UPDATE tasks SET completed = ? WHERE id = ?';
    db.query(query, [completed, id], (err) => {
        if (err) {
            console.error('Błąd podczas aktualizacji zadania:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else {
            res.json({ id, completed });
        }
    });
});

// Usuń zadanie
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Błąd podczas usuwania zadania:', err);
            res.status(500).json({ error: 'Błąd serwera' });
        } else {
            res.status(204).send(); // Brak zawartości
        }
    });
});

// Start serwera
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
