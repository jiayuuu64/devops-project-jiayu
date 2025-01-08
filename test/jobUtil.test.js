const { describe, it, before, after, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Job = require('../models/jobs');
chai.use(chaiHttp);

let baseUrl;
let validJobId;

describe('Job API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    beforeEach(async () => {
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

    afterEach(() => {
        sinon.restore(); // Restore all stubs
    });

    after(async () => {
        server.close(() => console.log('Server closed after tests.'));
    });

    describe('PUT /edit-job/:id', () => {
        it('should return 400 for invalid job ID format', (done) => {
            const invalidJobId = 'invalid-id';
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 6000,
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };
    
            chai.request(baseUrl)
                .put(`/edit-job/${invalidJobId}`)
                .send(data)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'Invalid job ID!');
                    done();
                });
        });
    
        it('should return 400 if a required field is missing', (done) => {
            const data = {
                location: 'Updated Location', // Missing 'name', 'description', etc.
            };
    
            chai.request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'Field name is required!');
                    done();
                });
        });
    
        it('should return 400 if salary is invalid (non-numeric)', (done) => {
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 'invalid', // Invalid salary
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };
    
            chai.request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'Salary must be a valid positive number!');
                    done();
                });
        });
    
        it('should return 400 if salary is zero or negative', (done) => {
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: -500, // Invalid salary
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };
    
            chai.request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'Salary must be a valid positive number!');
                    done();
                });
        });
    
        it('should return 404 if job is not found', (done) => {
            const nonExistentJobId = new mongoose.Types.ObjectId();
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 6000,
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };
    
            chai.request(baseUrl)
                .put(`/edit-job/${nonExistentJobId}`)
                .send(data)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'Job not found!');
                    done();
                });
        });
    
        it('should return 500 if a database error occurs', (done) => {
            sinon.stub(Job, 'findByIdAndUpdate').throws(new Error('Database error'));
    
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 6000,
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };
    
            chai.request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body).to.have.property('message', 'Error updating job');
                    Job.findByIdAndUpdate.restore(); // Restore stub
                    done();
                });
        });
    
        it('should update the job successfully with valid data', (done) => {
            const data = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 6000,
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company',
            };
    
            chai.request(baseUrl)
                .put(`/edit-job/${validJobId}`)
                .send(data)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Job updated successfully!');
                    expect(res.body.job).to.include(data);
                    done();
                });
        });
    });
    

    // Test GET /view-job/:id
    describe('GET /view-job/:id', () => {
        it('should return 200 and the job data for a valid ID', (done) => {
            chai.request(baseUrl)
                .get(`/view-job/${validJobId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('name', 'Sample Job');
                    done();
                });
        });

        it('should return 400 for invalid ObjectId format', (done) => {
            const invalidJobId = 'invalid-id';
            chai.request(baseUrl)
                .get(`/view-job/${invalidJobId}`)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'Invalid job ID!');
                    done();
                });
        });

        it('should return 404 if job not found', (done) => {
            const nonExistentJobId = new mongoose.Types.ObjectId();
            chai.request(baseUrl)
                .get(`/view-job/${nonExistentJobId}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'Job not found!');
                    done();
                });
        });

        it('should return 500 when findById throws an error', (done) => {
            sinon.stub(Job, 'findById').throws(new Error('Database error'));
            chai.request(baseUrl)
                .get(`/view-job/${validJobId}`)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body).to.have.property('message', 'Internal server error');
                    done();
                });
        });
    });
});
