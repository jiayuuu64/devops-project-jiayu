describe('Job Management Frontend', () => {
  let baseUrl;
  before(() => {
    cy.task('startServer').then((url) => {
      if (!url) throw new Error("Failed to retrieve base URL.");
      console.log("Base URL retrieved:", url);
      baseUrl = url ;
      cy.visit(baseUrl);
  });
  });
  after(() => {
    return cy.task('stopServer'); // Stop the server after the report is done
  });
  it('should update an existing job', () => {
    cy.visit(baseUrl);
    cy.log("Opening update modal...");
    cy.get('button').filter(':contains("Update Job Listing")').last().click();

    // Ensure the modal is visible
    cy.get('#jobName', { timeout: 10000 }).should('be.visible');

    // Update job details
    cy.log("Updating job details...");
    cy.get('#jobName').clear().type('Updated Job', { force: true });
    cy.get('#location').clear().type('Updated Location', { force: true });
    cy.get('#description').clear().type('Updated Description', { force: true });
    cy.get('#salary').clear().type('6000', { force: true });
    cy.get('#companyEmail').clear().type('updated@example.com', { force: true });
    cy.get('#companyName').clear().type('Updated Company', { force: true });

    // Click the update button
    cy.log("Submitting the updated job...");
    cy.get('button.modal-button').filter(':contains("Update Job")').click();

    // Verify the update in the job listing
    cy.log("Verifying job update...");
    cy.get('#job-listings').contains('Updated Job').should('exist');
  });
});

