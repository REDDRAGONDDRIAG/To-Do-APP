const Task = require('../models/taskModel');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.getAllTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

const addTask = async (req, res) => {
    try {
        const { name } = req.body;
        const newTask = await Task.createTask(name);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, completed } = req.body;
        const updatedTask = await Task.updateTask(id, name, completed);
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.deleteTask(id);
        res.json(deletedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
