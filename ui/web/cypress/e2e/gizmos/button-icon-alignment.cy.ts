describe("Icon-only Button alignment", () => {
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
