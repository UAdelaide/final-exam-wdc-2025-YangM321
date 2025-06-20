const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/summary', async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT
        u.username AS walker_username,
        COUNT(r.rating_id) AS total_ratings,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(DISTINCT wr.request_id) AS completed_walks
      FROM Users u
      LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id AND wa.status = 'accepted'
      LEFT JOIN WalkRequests wr ON wa.request_id = wr.request_id AND wr.status = 'completed'
      LEFT JOIN WalkRatings r ON wr.request_id = r.request_id AND r.walker_id = u.user_id
      WHERE u.role = 'walker'
      GROUP BY u.user_id, u.username
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch walker summary' });
    }
});

module.exports = router;
