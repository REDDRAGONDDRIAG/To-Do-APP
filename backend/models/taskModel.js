const db = require('../db');

const getAllTasks = async () => {
    const [rows] = await db.query('SELECT * FROM tasks');
    return rows;
};

const createTask = async (name) => {
    const [result] = await db.query('INSERT INTO tasks (name, completed) VALUES (?, ?)', [name, false]);
    return { id: result.insertId, name, completed: false };
};

const updateTask = async (id, name, completed) => {
    await db.query('UPDATE tasks SET name = ?, completed = ? WHERE id = ?', [name, completed, id]);
    return { id, name, completed };
};

const deleteTask = async (id) => {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    return { id };
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
