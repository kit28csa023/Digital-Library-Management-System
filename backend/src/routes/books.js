const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all books (Local)
router.get('/', (req, res) => {
    db.all(`SELECT books.*, users.name as added_by FROM books LEFT JOIN users ON books.user_id = users.id ORDER BY books.created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error fetching books' });
        res.json(rows);
    });
});

// Search books locally
router.get('/search', (req, res) => {
    const q = req.query.q;
    if (!q) return res.json([]);

    const searchStr = `%${q}%`;
    db.all(`SELECT books.*, users.name as added_by FROM books LEFT JOIN users ON books.user_id = users.id WHERE title LIKE ? OR author LIKE ? OR genre LIKE ? ORDER BY books.created_at DESC`, [searchStr, searchStr, searchStr], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error searching books' });
        res.json(rows);
    });
});

// Get single book details
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT books.*, users.name as added_by FROM books LEFT JOIN users ON books.user_id = users.id WHERE books.id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'Book not found' });
        res.json(row);
    });
});

// Add a book (Requires Auth)
router.post('/add', authMiddleware, (req, res) => {
    const { title, author, genre, description, cover_url, book_url } = req.body;
    const user_id = req.user.id;

    if (!title || !author) {
        return res.status(400).json({ error: 'Title and Author are required' });
    }

    const sql = `INSERT INTO books (title, author, genre, description, cover_url, book_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [title, author, genre, description, cover_url, book_url, user_id];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: 'Database error adding book' });
        res.status(201).json({ message: 'Book added successfully', book_id: this.lastID });
    });
});

module.exports = router;
