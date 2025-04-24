const express = require('express');
const cors = require('cors');  // Import CORS
const app = express();
const port = 3000;

app.use(cors());  // Zezwalaj na dostęp z różnych źródeł (frontend)
app.use(express.json());  // Aby obsługiwać JSON w ciele żądania

let tasks = [
    { id: 1, name: "Task 1", completed: false },
    { id: 2, name: "Task 2", completed: false }
];

// Endpoint do pobierania zadań
app.get('/api/tasks', (req, res) => {
    console.log("Zwracamy zadania:", tasks);  // Debugowanie
    res.json(tasks);  // Zwróć zadania w formacie JSON
});

// Endpoint do aktualizacji zadania (np. oznaczenie jako ukończone)
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);  // Pobierz id zadania
    const task = tasks.find(t => t.id === taskId);  // Znajdź zadanie

    if (task) {
        task.completed = req.body.completed;  // Zaktualizuj status zadania
        console.log("Zaktualizowane zadanie:", task);  // Debugowanie
        res.status(200).send('Task updated');  // Potwierdzenie
    } else {
        res.status(404).send('Task not found');  // Jeśli zadanie nie istnieje
    }
});

// Endpoint do dodania nowego zadania
app.post('/api/tasks', (req, res) => {
    const newTask = req.body;  // Pobierz dane nowego zadania
    newTask.id = tasks.length + 1;  // Automatycznie przypisz nowe id
    newTask.completed = false;  // Domyślnie zadanie nie jest ukończone
    tasks.push(newTask);  // Dodaj zadanie do listy
    console.log("Dodane zadanie:", newTask);  // Debugowanie
    res.status(201).send(newTask);  // Zwróć dodane zadanie
});

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
