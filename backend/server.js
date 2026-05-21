const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'devops_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// 1. Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json({ status: "Success", data: rows });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
});

// 2. Add a new task
app.post('/api/tasks', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ status: "Error", message: "Title is required" });
    
    try {
        const [result] = await pool.query('INSERT INTO tasks (title, status) VALUES (?, ?)', [title, 'Pending']);
        res.json({ status: "Success", data: { id: result.insertId, title, status: 'Pending' } });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
});

// 3. Toggle task status (Pending <-> Completed)
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
        res.json({ status: "Success", message: "Task updated successfully" });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
});

// 4. Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ status: "Success", message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1'); // Database check
        res.status(200).json({ status: "UP", database: "CONNECTED" });
    } catch (error) {
        res.status(500).json({ status: "DOWN", database: "DISCONNECTED", error: error.message });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Backend server active on port ${PORT}`));
}
