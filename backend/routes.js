const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');

const router = express.Router();

//rout for user login
router.post('/login', (req, res) =>{
    const { username, password} = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results)=> {
        if(err){
            return res.status(500).json({error: 'Database error'});
        }

        if(results.length === 0){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        const user = results[0];

        //compare the password with the hashed password in the db
        bcrypt.compare(password, user.password, (err, match) =>{
            if(err){
                return res.status(500).json({error: "error checking password"});
            }

            if(!match){
                return res.status(401).json({error: 'Invalid username or password'});
            }

            res.json({message: 'login successful', user:{id: user.id, username: user.username }});
        });
    });
});
// 
// Route to register a user
router.post('/addUser', async (req, res) => {
  const { username, email, password, password2, age } = req.body;

  if (!username || !email || !password || !password2 || !age) {
      return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== password2) {
      return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (username, email, password, age) VALUES (?, ?, ?, ?)';
      
      db.query(sql, [username, email, hashedPassword, age], (err, result) => {
          if (err) {
              return res.status(500).json({ error: 'Database error.' });
          }
          res.status(201).json({ message: 'User registered successfully!' });
      });
  } catch (error) {
      res.status(500).json({ error: 'Error processing request.' });
  }
});

  
  module.exports = router;