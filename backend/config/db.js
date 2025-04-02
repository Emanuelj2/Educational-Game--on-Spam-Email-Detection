

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // Change this to your MySQL username
  password: 'Pass-white28', // Change this to your MySQL password
  database: 'sse', // Change this to your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = db;