const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'a1785401',
    database: 'DogWalkService'
});

module.exports = pool;
