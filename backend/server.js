const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./config/db.js'); // Import the DB connection
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json


//user registration
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, securityQuestion, securityAnswer } = req.body;

  try {
    // Check if the email already exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      db.query(
        'INSERT INTO users (firstName, lastName, email, password, securityQuestion, securityAnswer) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, securityQuestion, securityAnswer],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Error inserting user into database' });
          }
          res.status(201).json({ success: true, message: 'User registered successfully!' });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});


//user Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Query to find the user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Passwords match, login successful
      return res.status(200).json({ success: true });
    } else {
      // Incorrect password
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
