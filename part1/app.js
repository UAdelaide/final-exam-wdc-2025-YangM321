const express = require('express');
const app = express();

const dogsRouter = require('./routes/dogs');
const walkRequestsRouter = require('./routes/walkrequests');
const walkersRouter = require('./routes/walkers');

app.use(express.json());
app.use('/api/dogs', dogsRouter);
app.use('/api/walkrequests', walkRequestsRouter);
app.use('/api/walkers', walkersRouter);

module.exports = app;
