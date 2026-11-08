describe('Application shell', () => {
    it('loads the application', () => {
        cy.visit('/');
        cy.contains('nav gauge').should('be.visible');
    });
});
