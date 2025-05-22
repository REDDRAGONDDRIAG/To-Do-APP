const Task = require('../models/taskModel');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

// Inicjalizacja Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const dbFire = getFirestore(app);

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Task name is required and cannot be empty' });
    }
    const newTask = await Task.createTask(name);
    const userId = req.user?.id || 'guest'; // Tymczasowy fallback
    await updateDoc(doc(dbFire, "users", userId), { score: firebase.firestore.FieldValue.increment(5) });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error.message);
    res.status(500).json({ error: 'Failed to add task', details: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, completed } = req.body;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }
    const updatedTask = await Task.updateTask(id, name, completed);
    if (completed) {
      const userId = req.user?.id || 'guest';
      const priority = updatedTask.priority || 'p5'; // Domyślna wartość, jeśli nie ma priorytetu
      const points = getPointsForPriority(priority.toLowerCase()); // Funkcja z frontendu
      await updateDoc(doc(dbFire, "users", userId), { score: firebase.firestore.FieldValue.increment(points) });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    const deletedTask = await Task.deleteTask(id);
    const userId = req.user?.id || 'guest';
    const priority = deletedTask.priority || 'p5'; // Domyślna wartość
    const points = getPointsForPriority(priority.toLowerCase()); // Funkcja z frontendu
    await updateDoc(doc(dbFire, "users", userId), { score: firebase.firestore.FieldValue.increment(points) });
    res.json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
};

// Funkcja punktacji (przeniesiona z frontendu)
function getPointsForPriority(priority) {
  switch (priority) {
    case 'p1': return 15;
    case 'p2': return 12;
    case 'p3': return 9;
    case 'p4': return 6;
    case 'p5': return 3;
    default: return 5;
  }
}

module.exports = { getTasks, addTask, updateTask, deleteTask };
