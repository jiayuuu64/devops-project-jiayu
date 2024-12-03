const request = require('supertest');
const { app, server } = require('../index'); // Import the app and server for testing
const mongoose = require('mongoose');
const Job = require('../models/jobs');

let baseUrl;
let validJobId;

beforeAll(async () => {
    // Ensure server is started and base URL is correctly set
    const { address, port } = await server.address();
    baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    console.log('Base URL:', baseUrl); // Log base URL for debugging
});

beforeEach(async () => {
    // Clear database and re-seed with sample job before each test
    await Job.deleteMany({});
    const sampleJob = new Job({
        name: 'Sample Job',
        location: 'Sample Location',
        description: 'This is a sample job description.',
        salary: 5000,
        companyEmail: 'sample@example.com',
        companyName: 'Sample Company',
    });
    const savedJob = await sampleJob.save();
    validJobId = savedJob._id.toString();
});

afterAll(async () => {
    // Clean up after all tests and close the server
    await Job.deleteMany({});
    server.close(() => console.log('Server closed after tests.'));
});

describe('Job API', () => {

    // Test PUT /edit-job/:id
    describe('PUT /edit-job/:id', () => {
        it('should return 400 for invalid job ID format', async () => {
            const invalidJobId = 'invalid-id';
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 6000,
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };

            const response = await request(baseUrl)
                .put(`/edit-job/${invalidJobId}`)
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid job ID!');
        });

        it('should return 400 if a required field is missing', async () => {
            const data = {
                location: 'Updated Location', // Missing 'name', 'description', etc.
            };

            const response = await request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Field name is required!');
        });

        it('should return 400 if salary is invalid (non-numeric)', async () => {
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 'invalid', // Invalid salary
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };

            const response = await request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Salary must be a valid positive number!');
        });

        it('should return 400 if salary is zero or negative', async () => {
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: -500, // Invalid salary
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };

            const response = await request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Salary must be a valid positive number!');
        });

        it('should return 404 if job is not found', async () => {
            const nonExistentJobId = new mongoose.Types.ObjectId();
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 6000,
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };

            const response = await request(baseUrl)
                .put(`/edit-job/${nonExistentJobId}`)
                .send(data);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Job not found!');
        });

        it('should return 500 if a database error occurs', async () => {
            // Stub the database method to simulate an error
            const originalMethod = Job.findByIdAndUpdate;
            Job.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 6000,
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };

            const response = await request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Error updating job');

            // Restore the original method
            Job.findByIdAndUpdate = originalMethod;
        });

        it('should update the job successfully with valid data', async () => {
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 6000,
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };

            const response = await request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Job updated successfully!');
            expect(response.body.job).toMatchObject(data);
        });
    });

    // Test GET /view-job/:id
    describe('GET /view-job/:id', () => {
        it('should return 200 and the job data for a valid ID', async () => {
            const response = await request(baseUrl)
                .get(`/view-job/${validJobId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'Sample Job');
        });

        it('should return 400 for invalid ObjectId format', async () => {
            const invalidJobId = 'invalid-id';
            const response = await request(baseUrl)
                .get(`/view-job/${invalidJobId}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid job ID!');
        });

        it('should return 404 if job not found', async () => {
            const nonExistentJobId = new mongoose.Types.ObjectId();
            const response = await request(baseUrl)
                .get(`/view-job/${nonExistentJobId}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Job not found!');
        });

        it('should return 500 when findById throws an error', async () => {
            // Stub the database method to simulate an error
            const originalMethod = Job.findById;
            Job.findById = jest.fn().mockRejectedValue(new Error('Database error'));

            const response = await request(baseUrl)
                .get(`/view-job/${validJobId}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Internal server error');

            // Restore the original method
            Job.findById = originalMethod;
        });
    });
});
