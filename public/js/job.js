async function addJob() {
    const name = document.getElementById('addJobName').value;
    const location = document.getElementById('addLocation').value;
    const description = document.getElementById('addDescription').value;
    const salary = document.getElementById('addSalary').value;
    const companyEmail = document.getElementById('addCompanyEmail').value;
    const companyName = document.getElementById('addCompanyName').value;

    const jobData = { name, location, description, salary, companyEmail, companyName };

    try {
        const response = await fetch('/add-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData)
        });
        const result = await response.json();
        if (response.ok) {
            alert('Job added successfully!');
            loadJobs();
            clearAndCloseModal();
        } else {
            alert('Failed to add job: ' + result.message);
        }
    } catch (error) {
        console.error('Error adding job:', error);
        alert('An error occurred while adding the job.');
    }
}

function clearAndCloseModal() {
    document.getElementById('addJobName').value = '';
    document.getElementById('addLocation').value = '';
    document.getElementById('addDescription').value = '';
    document.getElementById('addSalary').value = '';
    document.getElementById('addCompanyEmail').value = '';
    document.getElementById('addCompanyName').value = '';
    $('#resourceModal').modal('hide');
}

function applyJob(jobId) {
    $('#applyJobModal').modal('show');
    document.getElementById('applyJobModal').setAttribute('data-job-id', jobId);
}

async function submitApplication() {
    const jobId = document.getElementById('applyJobModal').getAttribute('data-job-id');
    const name = document.getElementById('applicantName').value.trim();
    const age = document.getElementById('applicantAge').value;
    const education = document.getElementById('applicantEducation').value.trim();
    const phone = document.getElementById('applicantPhone').value.trim();
    const email = document.getElementById('applicantEmail').value.trim();

    if (!name || !age || !education || !phone || !email) {
        alert('Please fill in all fields.');
        return;
    }

    const applicationData = { name, age, education, phone, email };

    try {
        const response = await fetch(`/apply-job/${jobId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(applicationData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Application submitted successfully!');
            $('#applyJobModal').modal('hide');
        } else {
            alert('Failed to submit application: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        alert('An error occurred while submitting the application.');
    }
}

async function loadJobs() {
    try {
        const response = await fetch('/view-jobs');
        const jobs = await response.json();
        displayJobs(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

async function searchJobs() {
    const keyword = document.getElementById("keyword").value;
    const classification = document.getElementById("classification").value;
    const query = new URLSearchParams({ keyword, classification }).toString();

    try {
        const response = await fetch(`/search-jobs?${query}`, { method: "GET" });
        if (response.ok) {
            const jobs = await response.json();
            displayJobs(jobs);
        } else {
            alert("Error searching jobs");
        }
    } catch (error) {
        console.error("Error searching jobs:", error);
    }
}

function displayJobs(jobs) {
    const jobListings = document.getElementById('job-listings');
    jobListings.innerHTML = '';
    if (jobs.length === 0) {
        jobListings.innerHTML = '<p>No job listings found.</p>';
        return;
    }

    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('job-listing');
        jobCard.innerHTML = `
            <div class="job-header">
                <h2>${job.name}</h2>
                <div class="job-actions">
                    <button onclick="applyJob('${job._id}')">Apply Job</button>
                    <button onclick="updateJob('${job._id}')">Update Job Listing</button>
                </div>
            </div>
            <p class="location">Location: ${job.location}</p>
            <p class="company">Company: ${job.companyName}</p>
            <p class="salary">Salary: $${job.salary}</p>
            <p class="email">Contact: <a href="mailto:${job.companyEmail}">${job.companyEmail}</a></p>
            <p>${job.description}</p>
        `;
        jobListings.appendChild(jobCard);
    });
}

async function updateJob(jobId) {
    try {
        const response = await fetch(`/view-job/${jobId}`);
        const job = await response.json();

        document.getElementById('jobId').value = job._id;
        document.getElementById('jobName').value = job.name;
        document.getElementById('location').value = job.location;
        document.getElementById('description').value = job.description;
        document.getElementById('salary').value = job.salary;
        document.getElementById('companyEmail').value = job.companyEmail;
        document.getElementById('companyName').value = job.companyName;
        document.getElementById('updateJobModal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching job:', error);
    }
}

function closeModal() {
    document.getElementById('updateJobModal').style.display = 'none';
}

async function submitJobUpdate() {
    const jobId = document.getElementById('jobId').value;
    const jobName = document.getElementById('jobName').value.trim();
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const salary = document.getElementById('salary').value;
    const companyEmail = document.getElementById('companyEmail').value.trim();
    const companyName = document.getElementById('companyName').value.trim();

    if (!jobName || !location || !description || !salary || !companyEmail || !companyName) {
        alert("Please fill all fields correctly.");
        return;
    }

    if (!companyEmail.includes('@') || !companyEmail.includes('.')) {
        alert("Please enter a valid email.");
        return;
    }

    if (salary <= 0) {
        alert("Salary must be a positive number.");
        return;
    }

    const jobData = { name: jobName, location, description, salary, companyEmail, companyName };

    try {
        const response = await fetch(`/edit-job/${jobId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData)
        });

        if (response.ok) {
            alert('Job updated successfully!');
            closeModal();
            loadJobs();
        } else {
            alert('Error updating job');
        }
    } catch (error) {
        console.error('Error updating job:', error);
    }
}

window.onclick = function (event) {
    const modal = document.getElementById('updateJobModal');
    if (event.target === modal) {
        closeModal();
    }
}

window.onload = loadJobs;
