describe("Rotation and step controls", () => {
    for (const size of ["xs", "sm", "md", "lg"]) {
        it(`sizes the ${size} rotation dial from theme control metrics, like the clock`, () => {
            cy.visit(
                `/iframe.html?id=forms-iconrotateinput--gallery&viewMode=story&args=size:${size}`,
            );
            cy.get('[class*="visual-container"]').should("have.length", 48);
            cy.window()
                .its("__STORYBOOK_PREVIEW__.channel")
                .invoke("emit", "updateStoryArgs", {
                    storyId: "forms-iconrotateinput--gallery",
                    updatedArgs: { size },
                });
            cy.get('.story [data-size][data-appearance-variant="ghost"]')
                .first()
                .should("have.attr", "data-size", size);
            cy.get(
                '[class*="visual-container"][data-appearance-color="neutral"]',
            )
                .should("have.length", 6)
                .should(($dials) => {
                    for (const dial of $dials.toArray()) {
                        const window = dial.ownerDocument.defaultView!;
                        const metrics = window.getComputedStyle(dial);
                        const diameter =
                            parseFloat(
                                metrics.getPropertyValue(
                                    "--size-control-height",
                                ),
                            ) * 2;
                        expect(dial.getBoundingClientRect().width).to.equal(
                            diameter,
                        );
                        expect(dial.getBoundingClientRect().height).to.equal(
                            diameter,
                        );
                        const icon = dial.querySelector(
                            "[data-appearance-glyph]",
                        )!;
                        expect(
                            parseFloat(window.getComputedStyle(icon).width),
                        ).to.equal(
                            parseFloat(
                                metrics.getPropertyValue(
                                    "--size-control-icon-size",
                                ),
                            ),
                        );
                    }
                });
        });
    }
    it("uses shared dial paints and keeps disabled above highlighted and focus", () => {
        cy.visit(
            "/iframe.html?id=forms-iconrotateinput--gallery&viewMode=story",
        );
        cy.get("#theme-appearance-variables").should("exist");
        cy.get('input[type="range"]').should("have.length", 48);
        cy.get<HTMLInputElement>(
            '.story [data-appearance-color="neutral"] input[type="range"]',
        )
            .should("have.length", 6)
            .each(($input) => {
                const input = $input[0];
                const owner = input.closest("[data-appearance-variant]")!;
                const dial = owner;
                const label = input.ownerDocument.querySelector(
                    `label[for="${input.id}"]`,
                )!;
                const window = input.ownerDocument.defaultView!;
                const reference = input.ownerDocument.createElement("span");
                owner.append(reference);
                owner.setAttribute("data-appearance-highlight", "hazard");
                for (const mode of ["light", "dark"]) {
                    cy.then(() => {
                        owner.setAttribute("data-appearance-mode", mode);
                        reference.style.color =
                            "var(--appearance-default-glyphs)";
                        expect(window.getComputedStyle(dial).color).to.equal(
                            window.getComputedStyle(reference).color,
                        );
                        const labelColor = window.getComputedStyle(label).color;
                        return labelColor;
                    }).as("labelColor");
                    cy.wrap(input).focus();
                    cy.wrap(dial).should("have.css", "outline-width", "2px");
                    cy.get<string>("@labelColor").then((labelColor) => {
                        expect(input.matches(":focus-visible")).to.equal(true);
                        reference.style.color =
                            "var(--appearance-hover-focus-glyphs)";
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
                        reference.style.color =
                            "var(--appearance-disabled-glyphs)";
                        expect(window.getComputedStyle(dial).color).to.equal(
                            window.getComputedStyle(reference).color,
                        );
                        expect(window.getComputedStyle(dial).cursor).to.equal(
                            "not-allowed",
                        );
                        owner.removeAttribute("data-highlighted");
                        owner.removeAttribute("data-disabled");
                    });
                    cy.wrap(input).blur();
                }
                cy.then(() => reference.remove());
            });
    });

    it("renders each step button variant across interaction states", () => {
        cy.visit("/iframe.html?id=forms-stepcontrols--gallery&viewMode=story");
        cy.get('button[aria-label="Value (+)"]').should("have.length", 48);
        cy.get(
            'button[aria-label="Value (+)"][data-appearance-color="neutral"]',
        )
            .should("have.length", 6)
            .each(($button) => {
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
                    ).to.equal(
                        window.getComputedStyle(reference).backgroundColor,
                    );
                }
                reference.remove();
            });
    });

    for (const component of [
        "slider",
        "clockinput",
        "clocksliceinput",
        "clockdurationinput",
        "iconrotateinput",
    ]) {
        it(`${component} keeps optional step button appearance independent from its own variant`, () => {
            const storyId = `forms-${component}--gallery`;
            const count = component === "iconrotateinput" ? 48 : 24;
            cy.visit(`/iframe.html?id=${storyId}&viewMode=story`);
            cy.get(".story table").should("exist");
            cy.window()
                .its("__STORYBOOK_PREVIEW__.channel")
                .invoke("emit", "updateStoryArgs", {
                    storyId,
                    updatedArgs: {
                        showStepControls: true,
                        ariaLabel: "Value",
                        showNumberInput: false,
                    },
                });
            cy.get('.story button[aria-label="Value (+)"]')
                .should("have.length", count)
                .each(($button) => {
                    expect($button.attr("data-appearance-variant")).to.equal(
                        "ghost",
                    );
                });
            if (component !== "clockdurationinput") {
                cy.window()
                    .its("__STORYBOOK_PREVIEW__.channel")
                    .invoke("emit", "updateStoryArgs", {
                        storyId,
                        updatedArgs: { showNumberInput: true },
                    });
                cy.get<HTMLInputElement>('.story input[aria-label="Value (#)"]')
                    .should("have.length", count)
                    .each(($input) => {
                        const field = $input[0].closest(
                            "[data-appearance-variant]",
                        )!;
                        expect(field.getBoundingClientRect().width).to.equal(
                            80,
                        );
                    });
            }
            for (const variant of ["outline", "inset"]) {
                cy.window()
                    .its("__STORYBOOK_PREVIEW__.channel")
                    .invoke("emit", "updateStoryArgs", {
                        storyId,
                        updatedArgs: { stepControlsProps: { variant } },
                    });
                cy.get('.story button[aria-label="Value (+)"]')
                    .first()
                    .should("have.attr", "data-appearance-variant", variant);
                cy.get('.story button[aria-label="Value (+)"]').each(
                    ($button) => {
                        expect(
                            $button.attr("data-appearance-variant"),
                        ).to.equal(variant);
                    },
                );
            }
            cy.window()
                .its("__STORYBOOK_PREVIEW__.channel")
                .invoke("emit", "updateStoryArgs", {
                    storyId,
                    updatedArgs: {
                        disabled: true,
                        stepControlsProps: {
                            variant: "outline",
                            disabled: false,
                        },
                    },
                });
            cy.get('.story button[aria-label="Value (+)"]').each(($button) => {
                cy.wrap($button).should("be.disabled");
            });
        });
    }
});
