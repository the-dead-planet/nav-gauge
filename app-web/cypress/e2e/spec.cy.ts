describe('example test', () => {
    it('passes', () => {
        cy.visit('/');
        cy.wait(2000).contains('nav gauge');
    });
});
