const express = require('express');
const router = express.Router();
const db = require('../db');

// Роут для получения всех функций
router.get('/', async (req, res) => {
    try {
        const [features] = await db.query('SELECT * FROM features');
        res.json(features);
    } catch (error) {
        console.error('Ошибка при получении функций:', error);
        res.status(500).json({ message: 'Ошибка при получении функций' });
    }
});

// Добавление новых фич
router.post('/', async (req, res) => {
    const { title, description, id_functions } = req.body;
    try {
        const [result] = await db.query('INSERT INTO features (title, description, id_functions) VALUES (?, ?, ?)', [title, description, id_functions]);
        res.status(201).json({ id: result.insertId, title, description, id_functions });
    } catch (err) {
        console.error('Ошибка при добавлении фичи:', err);
        res.status(500).json({ message: 'Ошибка при добавлении фичи' });
    }
});

module.exports = router;
