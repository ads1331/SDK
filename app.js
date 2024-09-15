const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); 

const app = express();
const port = 3000;

app.use(bodyParser.json()); 

// Получение всех постов (GET /api/posts)
app.get('/api/posts', async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM functions');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

// Получение поста по ID (GET /api/posts/:id)
app.get('/api/posts/:id', async (req, res) => {
    const postId = req.params.id;
    try {
      // Получаем пост
      const [postRows] = await db.query('SELECT * FROM functions WHERE id = ?', [postId]);
      if (postRows.length === 0) {
        return res.status(404).json({ message: 'Пост не найден' });
      }
      
      const post = postRows[0];
  
      // Получаем варианты голосования для этого поста
      const [voteRows] = await db.query('SELECT * FROM vote WHERE id_functions = ?', [postId]);
  
      // Добавляем варианты голосования к посту
      post.votes = voteRows;
  
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка базы данных' });
    }
  });
  

// Добавление нового поста (POST /api/posts) - только для админа
// TODO: Добавить проверку авторизации и роли администратора
app.post('/api/posts', async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO functions (title, description, status) VALUES (?, ?, ?)',
      [title, description, status || 'pending']
    );
    res.status(201).json({ id: result.insertId, title, description, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

// Изменение поста (PATCH /api/posts/:id) - только для админа
// TODO: Добавить проверку авторизации и роли администратора
app.patch('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, description, status } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE functions SET title = ?, description = ?, status = ? WHERE id = ?',
      [title, description, status, postId]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Пост обновлен' });
    } else {
      res.status(404).json({ message: 'Пост не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

// Удаление поста (DELETE /api/posts/:id) - только для админа
// TODO: Добавить проверку авторизации и роли администратора
app.delete('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM functions WHERE id = ?', [postId]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Пост удален' });
    } else {
      res.status(404).json({ message: 'Пост не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

// Принятие голосов (POST /api/posts/:id/vote) - голосование за пост
app.post('/api/posts/:id/votes', async (req, res) => {
  const postId = req.params.id;
  const { id_vote, id_user, ip } = req.body;

  try {
    // Проверка, существует ли пост
    const [post] = await db.query('SELECT * FROM functions WHERE id = ?', [postId]);
    if (post.length === 0) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Добавление голоса
    const [result] = await db.query(
      'INSERT INTO votes (id_functions, id_user, ip, id_vote) VALUES (?, ?, ?, ?)',
      [postId, id_user, ip, id_vote]
    );
    res.status(201).json({ message: 'Голос принят', vote_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка базы данных' });
  }
});

app.post('/api/votes', async (req, res) => {
    const { id_user, id_functions, id_vote, ip } = req.body;
  
    // Проверяем, что все необходимые данные присутствуют
    if (!id_user || !id_functions || !id_vote || !ip) {
      return res.status(400).json({ message: 'Недостаточно данных для голосования' });
    }
  
    try {
      // Вставляем данные о голосовании в таблицу votes
      const [result] = await db.query(
        'INSERT INTO votes (id_user, id_functions, id_vote, ip) VALUES (?, ?, ?, ?)',
        [id_user, id_functions, id_vote, ip]
      );
  
      // Отправляем успешный ответ клиенту
      res.status(201).json({ message: 'Голос успешно зарегистрирован', vote_id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка базы данных' });
    }
  });

  app.post('/api/vote', async (req, res) => {
    const { id_functions, title } = req.body;
  
    // Проверяем, что все необходимые данные присутствуют
    if (!id_functions || !title) {
      return res.status(400).json({ message: 'Недостаточно данных для добавления варианта голосования' });
    }
  
    try {
      // Вставляем новый вариант голосования в таблицу vote
      const [result] = await db.query(
        'INSERT INTO vote (id_functions, title) VALUES (?, ?)',
        [id_functions, title]
      );
  
      // Отправляем успешный ответ клиенту
      res.status(201).json({ message: 'Вариант голосования успешно добавлен', vote_id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка базы данных' });
    }
  });


  
// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
