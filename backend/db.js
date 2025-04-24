const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password', // Zmień na swoje hasło
    database: 'todo_app'
});

module.exports = db;
