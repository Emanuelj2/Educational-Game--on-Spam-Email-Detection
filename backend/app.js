const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');
const routes = require('./routes');


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
