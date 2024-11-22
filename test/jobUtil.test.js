const { describe, it } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let baseUrl;

describe('Job API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    describe('PUT /edit-job/:id', () => {
        let jobId = '672b3c53ea47aeba8e4f758c'; 
    
        it('should update an existing job', (done) => {
            const updatedData = {
                name: 'Updated Job',
                location: 'Updated Location',
                description: 'Updated description',
                salary: 6000,
                companyEmail: 'updated@example.com',
                companyName: 'Updated Company'
            };
    
            chai.request(baseUrl)
                .put(`/edit-job/${jobId}`)
                .send(updatedData)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Job updated successfully!');
                    expect(res.body).to.have.property('job');
                    expect(res.body.job).to.include(updatedData); // Check the updated fields in the job object
                    done();
                });
        });
    });
    
});
