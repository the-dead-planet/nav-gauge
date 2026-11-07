describe("Tile action footer", () => {
    it("keeps the footer flush with the surface and groups trailing actions without gaps", () => {
        cy.visit("/iframe.html?id=assemblies-tile--gallery&viewMode=story");
        cy.get(".story article")
            .first()
            .find("footer button")
            .should("have.length", 2);
        cy.get(".story article")
            .first()
            .then(($article) => {
                const article = $article[0];
                const footer = article.querySelector("footer")!;
                const [secondary, primary] = footer.querySelectorAll("button");
                const surfaceBounds = article.getBoundingClientRect();
                const footerBounds = footer.getBoundingClientRect();
                const secondaryBounds = secondary.getBoundingClientRect();
                const primaryBounds = primary.getBoundingClientRect();
                expect(footerBounds.left).to.be.closeTo(
                    surfaceBounds.left,
                    0.02,
                );
                expect(footerBounds.right).to.be.closeTo(
                    surfaceBounds.right,
                    0.02,
                );
                expect(footerBounds.bottom).to.be.closeTo(
                    surfaceBounds.bottom,
                    0.02,
                );
                expect(primaryBounds.right).to.be.closeTo(
                    footerBounds.right,
                    0.02,
                );
                expect(primaryBounds.bottom).to.be.closeTo(
                    footerBounds.bottom,
                    0.02,
                );
                expect(secondaryBounds.right).to.be.closeTo(
                    primaryBounds.left,
                    0.02,
                );
            });
    });
});
