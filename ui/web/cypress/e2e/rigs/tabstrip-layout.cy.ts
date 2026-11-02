describe("Tabstrip layout", () => {
    it("keeps the selected tab and content height correct through resizing and tab changes", () => {
        cy.visit("/iframe.html?id=rigs-tabstrip--playground&viewMode=story");
        cy.get('[role="tablist"]').parent().as("tabstrip");
        cy.get("@tabstrip").invoke("css", {
            width: "900px",
            maxWidth: "none",
        });
        cy.get("@tabstrip").find('[role="tab"]').should("have.length", 6);
        cy.get("@tabstrip").contains('[role="tab"]', "Terrain").click();
        cy.get("@tabstrip")
            .find('[role="tab"][aria-selected="true"]')
            .should("have.text", "Terrain");
        cy.get("@tabstrip")
            .find('[aria-hidden="true"][inert]')
            .should("not.exist");

        cy.window()
            .its("__STORYBOOK_PREVIEW__.channel")
            .invoke("emit", "updateStoryArgs", {
                storyId: "rigs-tabstrip--playground",
                updatedArgs: {
                    children:
                        "Resizable tab content with enough text to wrap. ".repeat(
                            20,
                        ),
                },
            });

        for (const width of [250, 460, 900, 200]) {
            cy.get("@tabstrip").invoke("css", "width", `${width}px`);
            cy.get("@tabstrip")
                .find('[role="tab"][aria-selected="true"]')
                .should(($tab) => {
                    expect($tab.text()).to.equal("Terrain");
                    const bounds = $tab[0].getBoundingClientRect();
                    const header = $tab[0]
                        .closest('[role="tablist"]')!
                        .getBoundingClientRect();
                    expect(bounds.right).to.be.at.most(header.right + 1);
                });
            cy.get("@tabstrip")
                .find('[role="tabpanel"]')
                .parent()
                .should(($content) => {
                    const content = $content[0];
                    const active = content.querySelector('[role="tabpanel"]')!;
                    expect(
                        content.getBoundingClientRect().height,
                    ).to.be.closeTo(active.getBoundingClientRect().height, 1);
                });
        }
    });
});
