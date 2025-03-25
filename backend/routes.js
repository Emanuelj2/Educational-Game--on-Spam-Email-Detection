const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');

const router = express.Router();
/*
router.post('/login', (req, res) =>{
    const { username, password} = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) =>{
        if(err || result.length == 0){
            return res.json({success: false, message: 'User not found'});
        }

    bcrypt.compare(password, result[0].password, (err, isMatch)=>{
        if(isMatch){
            const token = jwt.sign({userId: result[0].id}, 'your_jwt_secret');
            res.json({success:true, token});
        }else{
            res.json({success:false, message:'Invalid Password'});
        }
    });
    });
});
*/

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