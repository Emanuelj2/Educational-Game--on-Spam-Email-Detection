const mysql = require('mysql2/promise');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Create a connection pool with AWS RDS configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Additional AWS RDS specific configurations
  ssl: {
    rejectUnauthorized: false
  }
});

// Function to initialize the database
async function initializeDatabase() {
  try {
    // Test the connection
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database');
    connection.release();

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        securityQuestion VARCHAR(255) NOT NULL,
        securityAnswer VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create questions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        question TEXT NOT NULL,
        option1 VARCHAR(255) NOT NULL,
        option2 VARCHAR(255) NOT NULL,
        option3 VARCHAR(255) NOT NULL,
        option4 VARCHAR(255) NOT NULL,
        correctAnswer INT NOT NULL CHECK (correctAnswer BETWEEN 1 AND 4)
      )
    `);

    // Create leaderboard table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        playerName VARCHAR(255) NOT NULL,
        totalPoints INT NOT NULL DEFAULT 0,
        gamesPlayed INT NOT NULL DEFAULT 0,
        lastGameDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        UNIQUE KEY unique_user (userId)
      )
    `);

    // Check if questions table is empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM questions');
    if (rows[0].count === 0) {
      // Insert questions data
      await pool.query(`
        INSERT INTO questions (question, option1, option2, option3, option4, correctAnswer) VALUES
        ('Which of these is a red flag in an email?', 
         'A generic greeting like "Dear Customer"', 
         'An email from your manager', 
         'A newsletter you signed up for', 
         'An email with your name correctly spelled', 
         1),
        ('What should you do if an email claims you won a lottery you never entered?', 
         'Click the link to claim your prize', 
         'Reply with your details', 
         'Ignore or delete the email', 
         'Forward it to friends', 
         3),
        ('What is a common trick scammers use in emails?', 
         'Using a fake sender address that looks real', 
         'Providing customer service phone numbers', 
         'Sending emails only during business hours', 
         'Using company logos perfectly', 
         1),
        ('Which of these is a good way to check if an email is legitimate?', 
         'Hover over links to see the real URL', 
         'Click on every link to test them', 
         'Reply asking for verification', 
         'Open attachments to check for viruses', 
         1),
        ('What should you do if an email from your bank looks suspicious?', 
         'Call the bank using their official number', 
         'Reply to the email for confirmation', 
         'Click the link in the email and log in', 
         'Ignore it and assume it is safe', 
         1),
        ('Why do spam emails often have spelling mistakes?', 
         'Hackers are bad at spelling', 
         'To bypass spam filters', 
         'Because scammers don''t proofread', 
         'To make emails look more human', 
         2),
        ('Which attachment type is most likely to be dangerous in an email?', 
         '.pdf', 
         '.jpg', 
         '.exe', 
         '.mp3', 
         3),
        ('What is a "phishing" email?', 
         'An email offering free software', 
         'A scam email designed to steal personal information', 
         'A friendly email from a colleague', 
         'A subscription confirmation email', 
         2),
        ('Which of these email subjects is likely spam?', 
         'Your password will expire soon', 
         'Meeting reminder for tomorrow', 
         'Invoice for your recent purchase', 
         'Weekly report from HR', 
         1),
        ('Why should you not trust an email that threatens to close your account immediately?', 
         'Legitimate companies do not use threats', 
         'Threats make emails look professional', 
         'It is a new security policy', 
         'Emails should always be taken seriously', 
         1)
      `);
      console.log('Questions data inserted successfully');
    }

    // Create game_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        score INT NOT NULL,
        correct_answers INT NOT NULL,
        total_questions INT NOT NULL,
        completion_time INT NOT NULL,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { pool, initializeDatabase };