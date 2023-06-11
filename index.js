const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 4000;
app.use(express.json());
app.use(bodyParser.json());

app.use(cors({
  origin:"http://localhost:3000/"
}))

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI
  , {
useNewUrlParser: true,
useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
console.log("Connected to MongoDB!");
});

app.get("/", function (req, res) {
  res.send("<h1>Welcome to BackEnd...</h1>");
});

// Create Mongoose models for jobs, departments, job_depart_map
const Job = mongoose.model('Job', new mongoose.Schema({
  job_id: { type: Number, unique: true },
  job_title: String,
  exp_from: Number,
  exp_to: Number,
  work_loc: String,
  job_desc: String,
  job_openings: Number,
  depart: String,
  is_deleted: Number,
  created_by: Number,
  added_dt: Date,
  added_ts: Date,
  updated_dt: Date,
  updated_ts: Date,
}));

const Department = mongoose.model('Department', new mongoose.Schema({
  depart_id: { type: Number, unique: true },
  depart_name: String,
  is_deleted: Number,
  created_by: Number,
  added_dt: Date,
  added_ts: Date,
  updated_dt: Date,
  updated_ts: Date,
}));

const JobDepartmentMap = mongoose.model('JobDepartmentMap', new mongoose.Schema({
  id: { type: Number, unique: true },
  job_id: Number,
  depart_id: Number,
  added_dt: Date,
  added_ts: Date,
  updated_dt: Date,
  updated_ts: Date,
}));


// API endpoints

app.post('/get_all_jobs', async (req, res) => {
  
  const { job_id,
  job_title,
  exp_from,
  exp_to,
  work_loc,
  job_desc,
  job_openings,
  depart,
  is_deleted,
} = req.body

  const newJob = new Job({job_id,
    job_title,
    exp_from,
    exp_to,
    work_loc,
    job_desc,
    job_openings,
    depart,
    is_deleted
 })

  try {
      newJob.save()  
      res.send('Data saved successfully')  
  } catch (error) {
       return res.status(400).json({ message: error });
  }

});




app.post('/get_job', async (req, res) => {
  try {
    const { job_id } = req.body;
    const job = await Job.findOne({ job_id }).lean();
    const formattedJob = new Job({
      jobTitle: job.job_title,
      jobID: job.job_id,
      exp_from: job.exp_from,
      exp_to: job.exp_to,
      jobOpen: job.job_openings,
      jobDesc: job.job_desc,
      workLoc: job.work_loc,
      depart: job.depart
   
    });
    formattedJob.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
