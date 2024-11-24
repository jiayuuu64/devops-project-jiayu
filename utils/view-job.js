const Job = require('../models/jobs'); // Ensure correct model path

async function viewJobs(req, res) {
    try {
        const jobs = await Job.find(); // Fetch all jobs
        res.status(200).json(jobs); // Return jobs in JSON format
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
}

module.exports = { viewJobs };