const express = require('express');
const router = express.Router();
const db = require('../models/db');//connect to database

// GET all users (for testing/admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);//print log

  try {
    // Check if user exists with matching credentials
    const [rows] = await db.query(`
      SELECT user_id, username, role
      FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    console.log('Query result:', rows);//print result

    // No matching user
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Save user in session
    req.session.user = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    res.json({ message: 'Login successful', user: rows[0] });

  } catch (error) {
    console.error('Login error:', error); // print error details
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET current session user
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});


// add logout route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // clear cookie
    res.json({ message: 'Logout successful' });
  });
});

// add route to get dogs by owner id
// add route to get dogs by owner id
router.get('/dogs/owner', async (req, res) => {
  const ownerId = req.session.user?.user_id; // get user from session
  if (!ownerId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const [dogs] = await db.query('SELECT dog_id, name FROM Dogs WHERE owner_id = ?', [ownerId]);
    res.json(dogs); // return list of { dog_id, name }
  } catch (err) {
    console.error('Error fetching dogs for owner:', err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});



module.exports = router;
