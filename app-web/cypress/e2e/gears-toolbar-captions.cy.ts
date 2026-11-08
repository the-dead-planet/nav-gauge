describe("Gear toolbar captions", () => {
    it("uses a short single-line caption without increasing toolbar height", () => {
        cy.viewport(390, 640);
        cy.visit("/");
        const selector = 'button[aria-label="Route Story"]';

        for (const width of [320, 390, 600]) {
            cy.viewport(width, 640);
            cy.get(selector)
                .contains("span", "Story")
                .should("have.css", "font-size", "10px")
                .and("have.css", "white-space", "nowrap")
                .and("have.css", "text-transform", "uppercase");
            cy.get(selector).should(($button) => {
                const bounds = $button[0].getBoundingClientRect();
                const toolbar =
                    $button[0].parentElement!.getBoundingClientRect();
                expect(toolbar.height).to.equal(40);
                expect(bounds.top).to.be.at.least(toolbar.top);
                expect(bounds.bottom).to.be.at.most(toolbar.bottom);
            });
        }

        cy.get(selector).trigger("mouseover");
        cy.get('[role="tooltip"]').should("contain.text", "Route Story");

        cy.viewport(900, 640);
        cy.get(selector).should("contain.text", "Route Story");
        cy.get(selector)
            .parent()
            .should(($toolbar) => {
                expect($toolbar[0].getBoundingClientRect().height).to.equal(40);
            });
    });
});
