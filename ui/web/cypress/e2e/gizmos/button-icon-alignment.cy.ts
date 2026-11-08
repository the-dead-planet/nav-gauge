describe("Icon-only Button alignment", () => {
    it("renders a captioned hexagon as one native button with a compact caption", () => {
        cy.visit(
            '/iframe.html?id=gizmos-button--hexagon-caption&viewMode=story',
        );
        cy.get('button[aria-label="Record"]').should('have.length', 1).within(() => {
            cy.get('button').should('not.exist');
            cy.get('polygon').should('exist');
            cy.contains('span', 'Record')
                .should('have.css', 'font-size', '10px')
                .and('have.css', 'text-transform', 'uppercase');
            cy.get('[data-appearance-glyph]').should('exist');
        });
        cy.get('button[aria-label="Record"]').focus().should('be.focused');
    });

    it("keeps captioned and uncaptioned icons aligned and captions clickable", () => {
        cy.visit('/iframe.html?id=gizmos-button--captions&viewMode=story');
        cy.get('button[aria-label="Start recording"], button[aria-label="Pause recording"], button[aria-label="Without caption"]')
            .find('[data-appearance-glyph]').should('have.length', 3).should(($icons) => {
            const centers = [...$icons].map((icon) => {
                const bounds = icon.getBoundingClientRect();
                return bounds.top + bounds.height / 2;
            });
            expect(Math.max(...centers) - Math.min(...centers)).to.be.lessThan(1);
        });
        cy.get('button[aria-label="Start recording"]').then(($button) => {
            const onClick = cy.stub().as('recordClick');
            $button[0].addEventListener('click', onClick);
        });
        cy.contains('button span', 'Record').click();
        cy.get('@recordClick').should('have.been.calledOnce');
    });

    for (const corners of ["square", "circle", "hexagon"]) {
        it(`centers the icon in a ${corners} button with an empty label`, () => {
            cy.visit(
                `/iframe.html?id=gizmos-button--playground&viewMode=story&args=children:;corners:${corners}`,
            );
            cy.get("button [data-appearance-glyph]")
                .should("exist")
                .each(($element) => {
                    cy.wrap($element).should(($icon) => {
                        const icon = $icon[0].getBoundingClientRect();
                        const button = $icon[0]
                            .closest("button")!
                            .getBoundingClientRect();
                        expect(
                            Math.abs(
                                icon.left +
                                    icon.width / 2 -
                                    button.left -
                                    button.width / 2,
                            ),
                        ).to.be.lessThan(1);
                        expect(
                            Math.abs(
                                icon.top +
                                    icon.height / 2 -
                                    button.top -
                                    button.height / 2,
                            ),
                        ).to.be.lessThan(1);
                    });
                });
        });
    }
});
