describe("Button caption alignment", () => {
    for (const { text, lineCount } of [
        {
            text: "Fermare sorveglianza",
            lineCount: 2,
        },
        {
            text: "マーカー",
            lineCount: 1,
        },
    ]) {
        it(`centers "${text}" without splitting words`, () => {
            cy.readFile<string>("src/gizmos/button/button.module.css").then(
                (css) => {
                    cy.document().then((document) => {
                        const stylesheet = document.createElement("style");
                        stylesheet.textContent = css;
                        document.head.appendChild(stylesheet);
                        document.body.innerHTML = `
                    <button class="captioned-button" style="--caption-width:48px;--caption-gap:2px;margin-left:100px">
                        <span style="width:32px;height:32px"></span>
                        <span class="caption" style="font-size:10px;line-height:12px">${text}</span>
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
                expect(lines).to.have.length(lineCount);
                for (const line of lines) {
                    expect(
                        Math.abs(
                            line.left +
                                line.width / 2 -
                                icon.left -
                                icon.width / 2,
                        ),
                    ).to.be.lessThan(1);
                }
            });
        });
    }
});
