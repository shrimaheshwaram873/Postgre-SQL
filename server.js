// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const process = require('process');
const { Pool } = require('pg');

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(),'public')));




// Create a new Pool instance
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456789',
    port: 5432, // default port for PostgreSQL
  });
  
  // Connect to the database
  client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));
  
app.get('/',(req,res)=>{
    res.sendFile(path.join(process.cwd(),'public','temp.html'))
});

// Handle registration
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;


    console.log('User registered:', { username, password, email });
    console.log(typeof(username));

    const query = {
        text: 'INSERT INTO users(username, password, email) VALUES($1, $2, $3)',
        values: [username, password, email],
      };

      client.query(query, (err, result) => {
        if (err) {
          console.error('Query error', err.stack);
          return res.status(500).json({ message: 'Registration failed', error: err.message });
        }
        console.log('Query result:', result.rows);
        res.status(200).json({ message: 'Registration successful' });
      });
    });


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

