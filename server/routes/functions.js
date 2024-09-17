const express = require('express');
const router = express.Router();
const pool = require('../db'); // Подключение к базе данных

// Получение всех функций
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM functions');
        res.json(rows);
    } catch (error) {
        console.error('Ошибка при получении функций:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;