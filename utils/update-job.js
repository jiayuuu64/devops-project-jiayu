const mongoose = require('mongoose'); // Import mongoose
const Job = require('../models/jobs');

// Get a job by ID
async function getJobById(req, res) {
    try {
        const jobId = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: 'Invalid job ID!' });
        }

        // Fetch job
        const job = await Job.findById(jobId);
        if (job) {
            return res.status(200).json(job);
        } else {
            return res.status(404).json({ message: 'Job not found!' });
        }
    } catch (error) {
        console.error('Error fetching job:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// Edit job
async function editJob(req, res) {
    try {
        const jobId = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: 'Invalid job ID!' });
        }

        const updatedData = req.body;

        // Validate required fields
        const requiredFields = ['name', 'location', 'description', 'salary', 'companyEmail', 'companyName'];
        for (const field of requiredFields) {
            if (!updatedData[field]) {
                return res.status(400).json({ message: `Field ${field} is required!` });
            }
        }

        // Validate salary (must be a positive number)
        if (isNaN(updatedData.salary) || updatedData.salary <= 0) {
            return res.status(400).json({ message: 'Salary must be a valid positive number!' });
        }

        // Update the job
        const updatedJob = await Job.findByIdAndUpdate(jobId, updatedData, { new: true });
        if (updatedJob) {
            return res.status(200).json({ message: 'Job updated successfully!', job: updatedJob });
        } else {
            return res.status(404).json({ message: 'Job not found!' });
        }
    } catch (error) {
        console.error('Error editing job:', error);
        return res.status(500).json({ message: 'Error updating job', error: error.message });
    }
}

module.exports = {
    editJob,
    getJobById,
};
