const express = require('express');
const path = require('path');
const session = require('express-session'); // used to manage login session
const dogRoutes = require('./routes/dogRoutes'); // used to show dogs info

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/api/dogs', dogRoutes);

// Session middleware setup
app.use(session({
    secret: 'dogwalk-secret',
    resave: false,
    saveUninitialized: true
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;