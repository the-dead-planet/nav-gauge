describe("Button caption alignment", () => {
    it("centers both lines of a long caption under its icon", () => {
        cy.readFile<string>("src/gizmos/button/button.module.css").then(
            (css) => {
                cy.document().then((document) => {
                    const stylesheet = document.createElement("style");
                    stylesheet.textContent = css;
                    document.head.appendChild(stylesheet);
                    document.body.innerHTML = `
                    <button class="captioned-button" style="--caption-width:48px;--caption-gap:2px;margin-left:100px">
                        <span style="width:32px;height:32px"></span>
                        <span class="caption" style="font-size:10px;line-height:12px">Fermare sorveglianza</span>
                    </button>`;
                });
            },
        );
        cy.get(".caption").should(($caption) => {
            const caption = $caption[0];
            const icon =
                caption.previousElementSibling!.getBoundingClientRect();
            const range = caption.ownerDocument.createRange();
            range.selectNodeContents(caption);
            const lines = [...range.getClientRects()];
            expect(lines).to.have.length(2);
            for (const line of lines) {
                expect(
                    Math.abs(
                        line.left + line.width / 2 - icon.left - icon.width / 2,
                    ),
                ).to.be.lessThan(1);
            }
        });
    });
});
