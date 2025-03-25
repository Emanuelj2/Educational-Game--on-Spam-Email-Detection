// Import the mysql2 library
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'sse',
    password: 'Pass-white28'
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to the database successfully');
    }
});


module.exports = connection;

//  the data base connects don't change