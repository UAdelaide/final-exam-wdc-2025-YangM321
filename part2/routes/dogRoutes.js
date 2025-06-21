const express = require('express');
const router = express.Router();
const db = require('../models/db'); // connect to database

// GET all registered dogs (for public homepage)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT dog_id, name, size, owner_id
      FROM Dogs
    `);
        res.json(rows); // return dog info
    } catch (error) {
        console.error('Error fetching dogs:', error);
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

module.exports = router;
