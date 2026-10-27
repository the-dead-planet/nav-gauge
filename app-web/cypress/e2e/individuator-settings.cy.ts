describe('Individuator settings draft', () => {
    it('keeps language changes local until Save and discards them on Close', () => {
        cy.visit('/', {
            onBeforeLoad(window) {
                window.localStorage.clear();
            },
        });

        const openSettings = () => {
            cy.get('button[aria-label="Application menu"]').click();
            cy.get('[role="menu"] [role^="menuitem"]').first().click();
            cy.get('[role="dialog"]').should('be.visible');
        };
        const chooseGerman = () => {
            cy.get('button[aria-labelledby="individuator-language-label"]').click();
            cy.contains('[role="listbox"] [role="option"]', 'Deutsch').click();
        };

        openSettings();
        chooseGerman();
        cy.get('button[aria-label="Application menu"]').should('exist');
        cy.get('[role="dialog"]').contains('button', /^Close$/).click();
        cy.get('[role="dialog"]').should('not.exist');
        cy.get('button[aria-label="Application menu"]').should('exist');

        openSettings();
        cy.get('button[aria-labelledby="individuator-language-label"]').should('contain.text', 'English');
        chooseGerman();
        cy.get('button[aria-label="Application menu"]').should('exist');
        cy.get('[role="dialog"]').contains('button', /^Save$/).click();
        cy.get('[role="dialog"]').should('not.exist');
        cy.get('button[aria-label="Anwendungsmenü"]').should('exist');
        cy.reload();
        cy.get('button[aria-label="Anwendungsmenü"]').should('exist');
    });
});
