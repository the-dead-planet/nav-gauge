describe("Resize handle touch targets", () => {
    for (const direction of ["horizontal", "vertical"]) {
        it(`keeps a 48px target around the ${direction} grip on a narrow viewport`, () => {
            cy.viewport(390, 844);
            cy.visit(
                `/iframe.html?id=gizmos-resize-handle--playground&viewMode=story&args=direction:${direction}`,
            );
            cy.get('[role="separator"]').first().should((handle) => {
                const separator = handle[0];
                const grip = separator.querySelector('span[aria-hidden="true"]')!;
                const window = separator.ownerDocument.defaultView!;
                const bounds = grip.getBoundingClientRect();
                const targetStyle = window.getComputedStyle(grip, "::before");
                expect(targetStyle.width).to.equal("48px");
                expect(targetStyle.height).to.equal("48px");
                expect(bounds.width).to.equal(direction === "horizontal" ? 18 : 36);
                expect(bounds.height).to.equal(direction === "horizontal" ? 36 : 18);
                const target = separator.ownerDocument.elementFromPoint(
                    bounds.left + bounds.width / 2 + 20,
                    bounds.top + bounds.height / 2 + 20,
                );
                expect(target?.closest('[role="separator"]')).to.equal(separator);
            });
        });
    }
});
