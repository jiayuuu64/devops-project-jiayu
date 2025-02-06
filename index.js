const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const promClient = require('prom-client');
require('dotenv').config();
 
const app = express();
const PORT = process.env.PORT || 5050;
 
// Create Prometheus Registry
const register = new promClient.Registry();

// Default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Define your own custom metrics (example)
const jobSearchCounter = new promClient.Counter({
    name: 'job_search_requests_total',
    help: 'Total number of job search requests'
});
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const statusMonitor = require('express-status-monitor');
app.use(statusMonitor());

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Import job-related functions
const { searchJobs } = require('./utils/search-job');
app.get('/search-jobs', (req, res) => {
    jobSearchCounter.inc(); // Increment job search counter
    searchJobs(req, res);
});

const { addJob } = require('./utils/create-job');
app.post('/add-job', addJob);
 
const { editJob, getJobById } = require('./utils/update-job');
app.put('/edit-job/:id', editJob);
app.get('/view-job/:id', getJobById);
 
const { viewJobs } = require('./utils/view-job');
app.get('/view-jobs', viewJobs);

const { applyjob } = require('./utils/applyjob');
app.post('/apply-job/:jobId', applyjob);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
 
const server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address === "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`DevOps project at: ${baseUrl}`);
});
 
module.exports = { app, server };
