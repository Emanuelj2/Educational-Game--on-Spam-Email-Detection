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
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result] = await db.query(
      'INSERT INTO users (firstName, lastName, email, password, securityQuestion, securityAnswer) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, securityQuestion, securityAnswer]
    );

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});



//user Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query to find the user by email
    const [result] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

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
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});


//get the questions from the db
app.get('/questions', async (req, res) => {
  try {
    // Fetch a random question
    const [rows] = await db.query('SELECT * FROM questions ORDER BY RAND() LIMIT 1');

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No questions found' });
    }

    // Format the random question for the frontend
    const row = rows[0];
    const formatted = {
      question: row.question,
      options: [row.option1, row.option2, row.option3, row.option4],
      correctAnswer: row.correctAnswer - 1,  // Adjust correctAnswer if needed
    };

    res.json(formatted);  // Send the formatted random question as the response
  } catch (error) {
    console.error('Error fetching random question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
