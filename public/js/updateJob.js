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
        displayError('Error fetching job details.');
    }
}
function closeModal() {
    const modal = document.getElementById('updateJobModal');
    modal.style.display = 'none'; // Hide the modal
}


function displayError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
    console.log('Displayed error message:', message);
}

function displaySuccess(message) {
    const successMessageElement = document.getElementById('success-message');
    successMessageElement.textContent = message;
    successMessageElement.style.display = 'block'; // Make the message visible
    console.log('Displayed success message:', message);
}

async function submitJobUpdate() {
    const jobId = document.getElementById('jobId').value;
    const jobName = document.getElementById('jobName').value.trim();
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const salary = document.getElementById('salary').value.trim();
    const companyEmail = document.getElementById('companyEmail').value.trim();
    const companyName = document.getElementById('companyName').value.trim();

    const errorMessageElement = document.getElementById('error-message');
    const successMessageElement = document.getElementById('success-message');

    // Reset messages
    errorMessageElement.style.display = 'none';
    successMessageElement.style.display = 'none';

    // Validation checks
    if (!jobName || !location || !description || !salary || !companyEmail || !companyName) {
        displayError('Please fill all fields correctly.');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
        displayError('Please enter a valid email format.');
        return;
    }

    if (isNaN(salary) || Number(salary) <= 0) {
        displayError('Salary must be a valid positive number.');
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
            displaySuccess('Job updated successfully!');
            console.log('Job update succeeded.');
    
            // Delay closing the modal and reloading jobs
            setTimeout(() => {
                closeModal();
                loadJobs(); // Reload job listings
            }, 1500); // 1.5 seconds delay ensures visibility
        } else {
            // Handle response error
            const errorData = await response.json().catch(() => ({})); // Safely handle invalid JSON
            displayError(errorData.message || 'Error updating job: Server returned an unknown error');
            console.error('Server error while updating job:', errorData);
        }
    } catch (error) {
        // Handle unexpected errors
        displayError('Error updating job: ' + (error.message || 'Unknown error occurred'));
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
