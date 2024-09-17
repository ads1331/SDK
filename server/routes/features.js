const express = require('express');
const router = express.Router();
const db = require('../db');

// Роут для получения всех функций
router.get('/features', async (req, res) => {
    try {
        const [features] = await db.query('SELECT * FROM features');
        res.json(features);
    } catch (error) {
        console.error('Ошибка при получении функций:', error);
        res.status(500).json({ message: 'Ошибка при получении функций' });
    }
});

// Добавление новых фич (если нужно)
router.post('/features', async (req, res) => {
    const { title, description } = req.body;
    try {
        const [result] = await db.query('INSERT INTO features (title, description) VALUES (?, ?)', [title, description]);
        res.status(201).json({ id: result.insertId, title, description });
    } catch (err) {
        console.error('Ошибка при добавлении фичи:', err);
        res.status(500).json({ message: 'Ошибка при добавлении фичи' });
    }
});

module.exports = router;
