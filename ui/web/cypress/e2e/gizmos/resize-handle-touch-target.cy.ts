describe("Resize handle touch targets", () => {
    for (const direction of ["horizontal", "vertical"]) {
        it(`keeps a 24px target around the ${direction} grip on a narrow viewport`, () => {
            cy.viewport(390, 844);
            cy.visit(
                "/iframe.html?id=gizmos-resize-handle--gallery&viewMode=story",
            );
            cy.get(
                `[role="separator"][aria-orientation="${direction === "horizontal" ? "vertical" : "horizontal"}"]`,
            )
                .first()
                .scrollIntoView()
                .should((handle) => {
                    const separator = handle[0];
                    const grip = separator.querySelector(
                        'span[aria-hidden="true"]',
                    )!;
                    const window = separator.ownerDocument.defaultView!;
                    const bounds = grip.getBoundingClientRect();
                    const targetStyle = window.getComputedStyle(
                        grip,
                        "::before",
                    );
                    expect(targetStyle.width).to.equal("24px");
                    expect(targetStyle.height).to.equal("24px");
                    expect(bounds.width).to.equal(
                        direction === "horizontal" ? 18 : 36,
                    );
                    expect(bounds.height).to.equal(
                        direction === "horizontal" ? 36 : 18,
                    );
                    const target = separator.ownerDocument.elementFromPoint(
                        bounds.left + bounds.width / 2 + 10,
                        bounds.top + bounds.height / 2 + 10,
                    );
                    expect(target?.closest('[role="separator"]')).to.equal(
                        separator,
                    );
                });
        });
    }
});
