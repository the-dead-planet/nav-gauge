describe("Rotation and step controls", () => {
    for (const size of ["xs", "sm", "md", "lg"]) {
        it(`sizes the ${size} rotation dial from theme control metrics, like the clock`, () => {
            cy.visit(
                `/iframe.html?id=forms-iconrotateinput--gallery&viewMode=story&args=size:${size}`,
            );
            cy.get('[class*="visual-container"]').should("have.length", 8);
            cy.window()
                .its("__STORYBOOK_PREVIEW__.channel")
                .invoke("emit", "updateStoryArgs", {
                    storyId: "forms-iconrotateinput--gallery",
                    updatedArgs: { size },
                });
            cy.get('[data-size][data-appearance-variant="default"]')
                .first()
                .should("have.attr", "data-size", size);
            cy.get('[class*="visual-container"]')
                .should("have.length", 8)
                .each(($dial) => {
                    const dial = $dial[0];
                    const window = dial.ownerDocument.defaultView!;
                    const metrics = window.getComputedStyle(dial);
                    const diameter =
                        parseFloat(
                            metrics.getPropertyValue("--size-control-height"),
                        ) * 2;
                    expect(dial.getBoundingClientRect().width).to.equal(
                        diameter,
                    );
                    expect(dial.getBoundingClientRect().height).to.equal(
                        diameter,
                    );
                    const icon = dial.querySelector("[data-appearance-glyph]")!;
                    expect(
                        parseFloat(window.getComputedStyle(icon).width),
                    ).to.equal(
                        parseFloat(
                            metrics.getPropertyValue(
                                "--size-control-icon-size",
                            ),
                        ),
                    );
                });
        });
    }
    it("uses shared dial paints and keeps disabled above highlighted and focus", () => {
        cy.visit(
            "/iframe.html?id=forms-iconrotateinput--gallery&viewMode=story",
        );
        cy.get('input[type="range"]').should("have.length", 8);
        cy.get<HTMLInputElement>('input[type="range"]').each(($input) => {
            const input = $input[0];
            const owner = input.closest("[data-appearance-variant]")!;
            const dial = owner.querySelector('[class*="visual-container"]')!;
            const label = owner.querySelector("label")!;
            const window = input.ownerDocument.defaultView!;
            const reference = input.ownerDocument.createElement("span");
            owner.append(reference);
            owner.setAttribute("data-appearance-highlight", "hazard");
            for (const mode of ["light", "dark"]) {
                owner.setAttribute("data-appearance-mode", mode);
                reference.style.color = "var(--appearance-default-glyphs)";
                expect(window.getComputedStyle(dial).color).to.equal(
                    window.getComputedStyle(reference).color,
                );
                const labelColor = window.getComputedStyle(label).color;
                input.focus();
                expect(input.matches(":focus-visible")).to.equal(true);
                reference.style.color = "var(--appearance-hover-focus-glyphs)";
                expect(window.getComputedStyle(dial).color).to.equal(
                    window.getComputedStyle(reference).color,
                );
                expect(window.getComputedStyle(label).color).to.equal(
                    labelColor,
                );
                owner.setAttribute("data-highlighted", "true");
                reference.style.color =
                    "var(--appearance-active-pressed-glyphs)";
                expect(window.getComputedStyle(dial).color).to.equal(
                    window.getComputedStyle(reference).color,
                );
                owner.setAttribute("data-disabled", "true");
                reference.style.color = "var(--appearance-disabled-glyphs)";
                expect(window.getComputedStyle(dial).color).to.equal(
                    window.getComputedStyle(reference).color,
                );
                expect(window.getComputedStyle(dial).cursor).to.equal(
                    "not-allowed",
                );
                owner.removeAttribute("data-highlighted");
                owner.removeAttribute("data-disabled");
                input.blur();
            }
            reference.remove();
        });
    });

    it("renders the selected step button variants for every palette and status color", () => {
        cy.visit("/iframe.html?id=forms-stepcontrols--gallery&viewMode=story");
        cy.get('button[aria-label="Value (+)"]').should("have.length", 24);
        cy.get('button[aria-label="Value (+)"]').each(($button) => {
            const button = $button[0];
            const window = button.ownerDocument.defaultView!;
            const reference = button.ownerDocument.createElement("span");
            button.append(reference);
            for (const state of ["default", "active-pressed", "disabled"]) {
                button.setAttribute(
                    "data-highlighted",
                    String(state !== "default"),
                );
                button.toggleAttribute("disabled", state === "disabled");
                button.setAttribute(
                    "data-disabled",
                    String(state === "disabled"),
                );
                reference.style.backgroundColor = `var(--appearance-${state}-surface)`;
                expect(
                    window.getComputedStyle(button).backgroundColor,
                ).to.equal(window.getComputedStyle(reference).backgroundColor);
            }
            reference.remove();
        });
    });
});
