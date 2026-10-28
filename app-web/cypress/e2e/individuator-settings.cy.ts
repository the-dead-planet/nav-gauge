describe('Individuator settings draft', () => {
    it('keeps language changes local until Save and discards them on Close', () => {
        cy.visit('/', {
            onBeforeLoad(window) {
                window.localStorage.clear();
            },
        });

        cy.get('body')
            .should('have.attr', 'data-theme')
            .then((mode) => {
                if (mode === 'dark') {
                    cy.get('button[aria-label*="light" i]').click();
                }
            });
        cy.get('body').should('have.attr', 'data-theme', 'light');
        cy.get('#theme-appearance-variables').invoke('text').then((css) => {
            expect(css).to.include('light-dark(');
            const variants = [...css.matchAll(/\[data-appearance-variant="([^"]+)"\]/g)]
                .map((match) => match[1]);
            expect(variants.length).to.equal(new Set(variants).size);
        });

        const openSettings = () => {
            cy.get('button[aria-label="Application menu"]').click();
            cy.get('[role="menu"] [role^="menuitem"]').first().click();
            cy.get('[role="dialog"]').should('be.visible');
        };
        const chooseGerman = () => {
            cy.get(
                'button[aria-labelledby="individuator-language-label"]',
            ).click();
            cy.contains('[role="listbox"] [role="option"]', 'Deutsch').click();
        };

        openSettings();
        cy.get(
            '[role="dialog"] [data-appearance-variant="fill-translucent"]',
        ).then(($surface) => {
            const surface = $surface[0];
            const computed =
                surface.ownerDocument.defaultView?.getComputedStyle(surface);
            const foreground = computed?.color;
            expect(surface.getAttribute('data-appearance-mode')).to.equal(
                'dark',
            );
            expect(
                computed?.getPropertyValue('--appearance-color-100').trim(),
            ).to.equal(foreground);
            cy.get('[role="dialog"] h3').should(
                'have.css',
                'color',
                foreground,
            );
            const shadowColor = computed
                ?.getPropertyValue('--appearance-color-800')
                .trim();
            expect(computed?.textShadow).to.equal('none');
            cy.get('[role="dialog"] h3')
                .should('have.css', 'text-shadow')
                .and('contain', shadowColor);
            cy.get('#individuator-language-label')
                .should('have.css', 'color', foreground)
                .and('have.css', 'text-shadow')
                .and('contain', shadowColor);
        });
        cy.contains('[role="dialog"] button', /^Close$/)
            .should('have.attr', 'data-appearance-variant', 'fill-translucent')
            .and('have.attr', 'data-appearance-mode', 'dark');
        cy.contains('[role="dialog"] button', /^Save$/)
            .should('have.attr', 'data-appearance-variant', 'fill')
            .and('have.attr', 'data-appearance-mode', 'dark');
        cy.get('button[aria-labelledby="individuator-language-label"]')
            .closest('[data-appearance-mode]')
            .should('have.attr', 'data-appearance-mode', 'light');
        cy.get('[role="dialog"] button').each(($element) => {
            cy.wrap($element).should('have.css', 'text-shadow', 'none');
        });
        cy.contains('[role="dialog"] button', /^Close$/)
            .find('span')
            .should('have.css', 'text-shadow', 'none');
        cy.contains('[role="dialog"] button', /^Save$/)
            .find('span')
            .should('have.css', 'text-shadow', 'none');
        chooseGerman();
        cy.get('button[aria-label="Application menu"]').should('exist');
        cy.get('[role="dialog"]')
            .contains('button', /^Close$/)
            .click();
        cy.get('[role="dialog"]').should('not.exist');
        cy.get('button[aria-label="Application menu"]').should('exist');

        openSettings();
        cy.get('button[aria-labelledby="individuator-language-label"]').should(
            'contain.text',
            'English',
        );
        chooseGerman();
        cy.get('button[aria-label="Application menu"]').should('exist');
        cy.get('[role="dialog"]')
            .contains('button', /^Save$/)
            .click();
        cy.get('[role="dialog"]').should('not.exist');
        cy.get('button[aria-label="Anwendungsmenü"]').should('exist');
        cy.reload();
        cy.get('button[aria-label="Anwendungsmenü"]').should('exist');
    });
});
