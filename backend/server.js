const express = require('express');
const bcrypt = require('bcryptjs');
const { pool, initializeDatabase } = require('./config/db.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// user registration
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, securityQuestion, securityAnswer } = req.body;

  try {
    // Check if the email already exists in the database
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result] = await pool.query(
      'INSERT INTO users (firstName, lastName, email, password, securityQuestion, securityAnswer) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, securityQuestion, securityAnswer]
    );

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    logger.error("Error occurred while registering" + error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

//user Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query to find the user by email
    const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (result.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // Passwords match, login successful
      // Return user info (excluding password)
      const userInfo = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };
      
      return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        user: userInfo
      });
    } else {
      // Incorrect password
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    logger.error('Database error:', error);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

//get the questions from the db
app.get('/questions', async (req, res) => {
  try {
    // Fetch all questions for a game to prevent constant database queries
    const [rows] = await pool.query('SELECT * FROM questions ORDER BY RAND() LIMIT 10');

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No questions found' });
    }

    // Format all questions for the frontend
    const formattedQuestions = rows.map((row, index) => ({
      id: index + 1,
      question: row.question,
      options: [row.option1, row.option2, row.option3, row.option4],
      correctAnswer: row.correctAnswer - 1, // Adjust correctAnswer if needed
    }));

    res.status(200).json(formattedQuestions);  // Send all formatted questions as the response
  } catch (error) {
    logger.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Submit game score and update leaderboard
app.post('/submit-score', async (req, res) => {
  const { userId, score } = req.body;

  try {
    // Get user information
    const [userResult] = await pool.query(
      'SELECT firstName, lastName FROM users WHERE id = ?',
      [userId]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const playerName = `${userResult[0].firstName} ${userResult[0].lastName}`;
    const points = Math.round(score); // Convert score percentage to points

    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check if user exists in leaderboard
      const [leaderboardResult] = await connection.query(
        'SELECT * FROM leaderboard WHERE userId = ?',
        [userId]
      );

      if (leaderboardResult.length === 0) {
        // Insert new record
        await connection.query(
          'INSERT INTO leaderboard (userId, playerName, totalPoints, gamesPlayed, lastGameDate) VALUES (?, ?, ?, 1, NOW())',
          [userId, playerName, points]
        );
      } else {
        // Update existing record
        await connection.query(
          'UPDATE leaderboard SET totalPoints = totalPoints + ?, gamesPlayed = gamesPlayed + 1, lastGameDate = NOW() WHERE userId = ?',
          [points, userId]
        );
      }

      await connection.commit();
      res.status(200).json({ success: true, message: 'Score submitted successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error submitting score:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get leaderboard data
app.get('/leaderboard', async (req, res) => {
  const { type } = req.query; // 'weekly' or 'allTime'
  
  try {
    let query;
    if (type === 'weekly') {
      // Get top 10 players for the current week
      query = `
        SELECT 
          playerName,
          totalPoints,
          gamesPlayed,
          lastGameDate
        FROM leaderboard
        WHERE YEARWEEK(lastGameDate) = YEARWEEK(NOW())
        ORDER BY totalPoints DESC
        LIMIT 10
      `;
    } else {
      // Get top 10 players of all time
      query = `
        SELECT 
          playerName,
          totalPoints,
          gamesPlayed,
          lastGameDate
        FROM leaderboard
        ORDER BY totalPoints DESC
        LIMIT 10
      `;
    }

    const [results] = await pool.query(query);
    
    // Format the results
    const formattedResults = results.map((row, index) => ({
      rank: index + 1,
      playerName: row.playerName,
      totalPoints: row.totalPoints,
      gamesPlayed: row.gamesPlayed,
      lastPlayed: row.lastGameDate
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

const PORT = 8080;

// Initialize the database before starting the server
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0',() => {
    logger.info( `Server running on port 0.0.0.0:${PORT}`);
  });
}).catch(err => {
  logger.error('Failed to initialize database:', err);
  process.exit(1);
});
