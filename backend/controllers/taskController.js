const db = require('../db');
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

const getAllTasks = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks');
    return rows;
  } catch (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
};

const createTask = async (name, priority = 'p5') => {
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Task name is required and cannot be empty');
    }
    const [result] = await db.query(
      'INSERT INTO tasks (name, priority, completed) VALUES (?, ?, ?)',
      [name, priority, false]
    );
    const userId = 'guest'; // Zastąp dynamicznym userId po dodaniu uwierzytelnienia
    await updateDoc(doc(dbFire, "users", userId), { score: firebase.firestore.FieldValue.increment(5) });
    return { id: result.insertId, name, priority, completed: false };
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
};

const updateTask = async (id, name, completed, priority) => {
  try {
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Invalid task ID');
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      throw new Error('Completed must be a boolean');
    }
    const [result] = await db.query(
      'UPDATE tasks SET name = ?, completed = ?, priority = ? WHERE id = ?',
      [name, completed, priority, id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Task not found');
    }
    if (completed) {
      const userId = 'guest'; // Zastąp dynamicznym userId
      const points = getPointsForPriority(priority.toLowerCase());
      await updateDoc(doc(dbFire, "users", userId), { score: firebase.firestore.FieldValue.increment(points) });
    }
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
};

const deleteTask = async (id) => {
  try {
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Invalid task ID');
    }
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('Task not found');
    }
    const { priority } = rows[0];
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    const userId = 'guest'; // Zastąp dynamicznym userId
    const points = getPointsForPriority(priority.toLowerCase());
    await updateDoc(doc(dbFire, "users", userId), { score: firebase.firestore.FieldValue.increment(points) });
    return { id, ...rows[0] };
  } catch (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
};

// Funkcja punktacji
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

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
