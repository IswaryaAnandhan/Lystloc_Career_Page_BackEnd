const express = require('express');
const mysql = require('mysql');
require("dotenv").config();
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(cors({
  origin:"http://localhost:3000"
}))

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.password,
  database: 'lystloc_jobs'
});

// Check the database connection
connection.connect((error) => {
  if (error) {
    console.error('Failed to connect to the database:', error.message);
  } else {
    console.log('Connected to the database');
  }
});

// Get all jobs
app.post('/get_all_jobs', (req, res) => {
  connection.query('SELECT * FROM jobs', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Get individual job details by job ID
app.post('/get_job', (req, res) => {
  const { job_id } = req.body;
  const query = `SELECT * FROM jobs WHERE job_id = ${job_id}`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching job details from the database');
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Job not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Get all Departments
app.get('/departments', (req, res) => {
  connection.query('SELECT * FROM departments', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
