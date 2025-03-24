// Import the mysql2 library
const mysql = require('mysql2');

let connection;

try {
    connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        database: 'projetDB',
        password: 'Pass-white28'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Database connection failed:', err.message);
        } else {
            console.log('Connected to the database successfully');
        }
    });
} catch (error) {
    console.error('Error creating MySQL connection:', error.message);
}

module.exports = connection;
