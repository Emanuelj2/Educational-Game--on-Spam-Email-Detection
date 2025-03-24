const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

//create account and add it to the database if the username is not already taken
//along with hashing the password for security
//and the first passowrd has to match the secon password to create the account
//and if the account is created successfully, it will return success: true
router.post('/createAccount', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.json({ success: false, message: 'Error hashing password' });
      }
  
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
          return res.json({ success: false, message: 'Error creating account' });
        }
        res.json({ success: true });
      });
    });
  });

  
  module.exports = router;