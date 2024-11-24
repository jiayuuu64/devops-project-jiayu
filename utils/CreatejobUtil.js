const Job = require('../models/jobs');
 
// Add a new job
async function addJob(req, res) {
    try {
        const { name, location, description, salary, companyEmail, companyName } = req.body;
 
        // Validate required fields
        if (!companyEmail.includes('@') || !companyEmail.includes('.') || description.length < 6) {
            return res.status(400).json({ message: 'Validation error' });
        }
 
        // Create and save the new job using the Job model
        const newJob = new Job({
            name,
            location,
            description,
            salary,
            companyEmail,
            companyName
        });
 
        const savedJob = await newJob.save();
        return res.status(201).json(savedJob);
    } catch (error) {
        console.error("Error adding job:", error);
        return res.status(500).json({ message: error.message });
    }
}
 
module.exports = {
    addJob
};