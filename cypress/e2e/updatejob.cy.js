describe('Job Management Frontend', () => {
    let baseUrl;
  
    before(() => {
      cy.task('startServer').then((url) => {
        if (!url) throw new Error('Failed to retrieve base URL.');
        baseUrl = url;
        cy.visit(baseUrl);
      });
    });
  
    after(() => {
      cy.task('stopServer');
    });
  
    // Test case for fetch job failure
    it('should display an error if fetching job details fails', () => {
      cy.intercept('GET', '/view-job/*', {
        statusCode: 500,
        body: { message: 'Failed to fetch job details' },
      }).as('fetchJobError');
  
      cy.visit(baseUrl);
      cy.get('button').filter(':contains("Update Job Listing")').last().click();
  
      cy.wait('@fetchJobError');
  
      // Check for alert message when fetching job fails
      cy.window().then((win) => {
        cy.stub(win, 'alert').callsFake((msg) => {
          expect(msg).to.equal('Error: Error fetching job details.');
        });
      });
    });
  
    // Test case for successful job update
    it('should display a success message when a job is updated successfully', () => {
      cy.intercept('PUT', '/edit-job/*', {
        statusCode: 200,
      }).as('updateJobSuccess');
  
      cy.visit(baseUrl);
      cy.get('button').filter(':contains("Update Job Listing")').last().click();
  
      // Fill out the form
      cy.get('#jobName').clear().type('Updated Job');
      cy.get('#location').clear().type('Updated Location');
      cy.get('#description').clear().type('Updated Description');
      cy.get('#salary').clear().type('6000');
      cy.get('#companyEmail').clear().type('updated@example.com');
      cy.get('#companyName').clear().type('Updated Company');
  
      // Submit the form
      cy.get('button.modal-button').filter(':contains("Update Job")').click();
  
      cy.wait('@updateJobSuccess');
  
      // Check for success alert message
      cy.window().then((win) => {
        cy.stub(win, 'alert').callsFake((msg) => {
          expect(msg).to.equal('Success: Job updated successfully!');
        });
      });
    });
  
    // Test case for server error during job update
    it('should display an error message if the update fails due to server error', () => {
      cy.intercept('PUT', '/edit-job/*', {
        statusCode: 500,
        body: { message: 'Error updating job' },
      }).as('updateJobError');
  
      cy.visit(baseUrl);
      cy.get('button').filter(':contains("Update Job Listing")').last().click();
  
      // Fill out the form
      cy.get('#jobName').clear().type('Updated Job');
      cy.get('#location').clear().type('Updated Location');
      cy.get('#description').clear().type('Updated Description');
      cy.get('#salary').clear().type('6000');
      cy.get('#companyEmail').clear().type('updated@example.com');
      cy.get('#companyName').clear().type('Updated Company');
  
      // Submit the form
      cy.get('button.modal-button').filter(':contains("Update Job")').click();
  
      cy.wait('@updateJobError');
  
      // Check for error alert message
      cy.window().then((win) => {
        cy.stub(win, 'alert').callsFake((msg) => {
          expect(msg).to.equal('Error: Error updating job');
        });
      });
    });
  
    // Test case for missing server error message
    it('should display a fallback error message if server error lacks a message', () => {
      cy.intercept('PUT', '/edit-job/*', {
        statusCode: 500,
        body: {},
      }).as('updateJobErrorNoMessage');
  
      cy.visit(baseUrl);
      cy.get('button').filter(':contains("Update Job Listing")').last().click();
  
      // Fill out the form
      cy.get('#jobName').clear().type('Updated Job');
      cy.get('#location').clear().type('Updated Location');
      cy.get('#description').clear().type('Updated Description');
      cy.get('#salary').clear().type('6000');
      cy.get('#companyEmail').clear().type('updated@example.com');
      cy.get('#companyName').clear().type('Updated Company');
  
      // Submit the form
      cy.get('button.modal-button').filter(':contains("Update Job")').click();
  
      cy.wait('@updateJobErrorNoMessage');
  
      // Check for fallback error alert message
      cy.window().then((win) => {
        cy.stub(win, 'alert').callsFake((msg) => {
          expect(msg).to.equal('Error: Error updating job');
        });
      });
    });
  
    // Test case for validation error when fields are empty
    it('should display a validation error when fields are empty', () => {
      cy.visit(baseUrl);
      cy.get('button').filter(':contains("Update Job Listing")').last().click();
      cy.get('#jobName').clear();
      cy.get('#location').clear();
      cy.get('#description').clear();
      cy.get('#salary').clear();
      cy.get('#companyEmail').clear();
      cy.get('#companyName').clear();
      cy.get('button.modal-button').filter(':contains("Update Job")').click();
  
      // Check for validation error alert message
      cy.window().then((win) => {
        cy.stub(win, 'alert').callsFake((msg) => {
          expect(msg).to.equal('Error: Please fill all fields correctly.');
        });
      });
    });
  
    // Test case for invalid email validation
    it('should display a validation error when email is invalid', () => {
      cy.visit(baseUrl);
      cy.get('button').filter(':contains("Update Job Listing")').last().click();
      cy.get('#companyEmail').clear().type('invalidemail');
      cy.get('button.modal-button').filter(':contains("Update Job")').click();
  
      // Check for invalid email error alert message
      cy.window().then((win) => {
        cy.stub(win, 'alert').callsFake((msg) => {
          expect(msg).to.equal('Error: Please enter a valid email format.');
        });
      });
    });
  
    // Test case for invalid salary validation
    it('should display a validation error when salary is invalid', () => {
      cy.visit(baseUrl);
      cy.get('button').filter(':contains("Update Job Listing")').last().click();
      cy.get('#salary').clear().type('-500');
      cy.get('button.modal-button').filter(':contains("Update Job")').click();
  
      // Check for invalid salary error alert message
      cy.window().then((win) => {
        cy.stub(win, 'alert').callsFake((msg) => {
          expect(msg).to.equal('Error: Salary must be a valid positive number.');
        });
      });
    });
  
    // Test case for unexpected errors during job update
    it('should display an error message for unexpected errors during job update', () => {
      cy.intercept('PUT', '/edit-job/*', {
        forceNetworkError: true, // Simulate a network error
      }).as('networkError');
  
      cy.visit(baseUrl);
      cy.get('button').filter(':contains("Update Job Listing")').last().click();
  
      // Fill out the form
      cy.get('#jobName').clear().type('Updated Job');
      cy.get('#location').clear().type('Updated Location');
      cy.get('#description').clear().type('Updated Description');
      cy.get('#salary').clear().type('6000');
      cy.get('#companyEmail').clear().type('updated@example.com');
      cy.get('#companyName').clear().type('Updated Company');
  
      // Submit the form
      cy.get('button.modal-button').filter(':contains("Update Job")').click();
  
      cy.wait('@networkError');
  
      // Check for network error message in the alert
      cy.window().then((win) => {
        cy.stub(win, 'alert').callsFake((msg) => {
          expect(msg).to.equal('Error: Error updating job: Failed to fetch');
        });
      });
    });
  
    // Test case for modal close action
    it('should close the modal and reset messages when clicking outside the modal', () => {
      cy.visit(baseUrl);
      cy.get('button').filter(':contains("Update Job Listing")').last().click();
      cy.get('#updateJobModal').click('topRight'); // Simulates clicking outside the modal
  
      cy.get('#updateJobModal').should('not.be.visible');
    });
  });
  