async function updateJob(jobId) {
    try {
        const response = await fetch(`/view-job/${jobId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch job details');
        }

        const job = await response.json();

        // Populate modal with job details
        document.getElementById('jobId').value = job._id;
        document.getElementById('jobName').value = job.name;
        document.getElementById('location').value = job.location;
        document.getElementById('description').value = job.description;
        document.getElementById('salary').value = job.salary;
        document.getElementById('companyEmail').value = job.companyEmail;
        document.getElementById('companyName').value = job.companyName;

        // Display the modal
        document.getElementById('updateJobModal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching job:', error);
        displayMessage('Error fetching job details.', 'error');
    }
}

function closeModal() {
    const modal = document.getElementById('updateJobModal');
    modal.style.display = 'none'; // Hide the modal
}

function displayMessage(message, type) {
    // Show success or error message in a simple prompt (alert)
    if (type === 'error') {
        alert('Error: ' + message); // Display error message in an alert
    } else if (type === 'success') {
        alert('Success: ' + message); // Display success message in an alert
    }
    console.log(type === 'error' ? 'Displayed error message' : 'Displayed success message:', message);
}

async function submitJobUpdate() {
    const jobId = document.getElementById('jobId').value;
    const jobName = document.getElementById('jobName').value.trim();
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const salary = document.getElementById('salary').value.trim();
    const companyEmail = document.getElementById('companyEmail').value.trim();
    const companyName = document.getElementById('companyName').value.trim();

    // Validation checks
    if (!jobName || !location || !description || !salary || !companyEmail || !companyName) {
        displayMessage('Please fill all fields correctly.', 'error');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
        displayMessage('Please enter a valid email format.', 'error');
        return;
    }

    if (isNaN(salary) || Number(salary) <= 0) {
        displayMessage('Salary must be a valid positive number.', 'error');
        return;
    }

    const jobData = { name: jobName, location, description, salary, companyEmail, companyName };

    try {
        const response = await fetch(`/edit-job/${jobId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData),
        });

        if (response.ok) {
            displayMessage('Job updated successfully!', 'success');
            console.log('Job update succeeded.');

            // Delay closing the modal and reloading jobs
            setTimeout(() => {
                closeModal();
                loadJobs(); // Reload job listings
            }, 1500); // 1.5 seconds delay ensures visibility
        } else {
            const errorData = await response.json();
            displayMessage(errorData.message || 'Error updating job', 'error');
        }
    } catch (error) {
        displayMessage('Error updating job: ' + (error.message || 'Unknown error occurred'), 'error');
        console.error('Unexpected error while updating job:', error);
    }
}

window.onclick = function (event) {
    const modal = document.getElementById('updateJobModal');
    if (event.target === modal) {
        closeModal();
    }
};

window.onload = loadJobs;
