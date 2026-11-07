describe("Color controls", () => {
    it("keeps swatch parents and ramp frames fixed through interaction", () => {
        cy.visit("/iframe.html?id=forms-colorbutton--gallery&viewMode=story");
        cy.get('.story button[aria-pressed]').should('be.visible');
        cy.document().then((document) => document.fonts.ready);
        cy.get(".story button[aria-pressed]")
            .first()
            .then(($button) => {
                const button = $button[0];
                const table = button.closest("table")!;
                const bounds = table.getBoundingClientRect();
                cy.wrap($button)
                    .click()
                    .should("have.attr", "aria-pressed", "true")
                    .then(() => {
                        expect(table.getBoundingClientRect().width).to.equal(
                            bounds.width,
                        );
                        expect(table.getBoundingClientRect().height).to.equal(
                            bounds.height,
                        );
                    });
            });
        cy.visit("/iframe.html?id=forms-colorramp--gallery&viewMode=story");
        cy.get<HTMLElement>(
            '.story [role="slider"], .story input[type="range"]',
        ).each(($control) => {
            const control = $control[0];
            const bounds = control.getBoundingClientRect();
            const window = control.ownerDocument.defaultView!;
            const border = window.getComputedStyle(control).borderWidth;
            control.focus();
            expect(control.getBoundingClientRect().width).to.equal(
                bounds.width,
            );
            expect(control.getBoundingClientRect().height).to.equal(
                bounds.height,
            );
            expect(window.getComputedStyle(control).borderWidth).to.equal(
                border,
            );
        });
        cy.get('[role="slider"] > span').should("have.css", "cursor", "grab");
    });

    it("shares interactive values with story args in Playground and Gallery", () => {
        for (const view of ["playground", "gallery"]) {
            const storyId = `forms-colorrampopacity--${view}`;
            cy.visit(`/iframe.html?id=${storyId}&viewMode=story`);
            cy.get<HTMLInputElement>('.story input[type="range"]')
                .first()
                .then(($input) => {
                    const input = $input[0];
                    input.stepUp();
                    input.dispatchEvent(
                        new input.ownerDocument.defaultView!.Event("input", {
                            bubbles: true,
                        }),
                    );
                });
            cy.get('.story input[type="range"]')
                .last()
                .should("have.value", "0.61");
            cy.window()
                .its("__STORYBOOK_PREVIEW__.channel")
                .invoke("emit", "updateStoryArgs", {
                    storyId,
                    updatedArgs: { value: 0.3 },
                });
            cy.get('.story input[type="range"]')
                .last()
                .should("have.value", "0.3");
        }
    });

    it("holds hue steady while saturation changes in the composed picker", () => {
        cy.visit("/iframe.html?id=forms-colorpicker--gallery&viewMode=story");
        cy.get<HTMLInputElement>('input[type="range"][max="360"]')
            .first()
            .then(($hue) => {
                const hue = $hue.val();
                cy.get('[role="slider"]')
                    .first()
                    .focus()
                    .trigger("keydown", { key: "ArrowLeft", shiftKey: true });
                cy.get('[role="slider"]')
                    .first()
                    .should("have.attr", "aria-valuenow", "57");
                cy.get('input[type="range"][max="360"]')
                    .first()
                    .should("have.value", hue);
            });
    });

    it("resolves all color field variants and palettes through focus, highlight and disabled", () => {
        cy.visit("/iframe.html?id=forms-colorinput--gallery&viewMode=story");
        cy.get("#theme-appearance-variables").should("exist");
        cy.get<HTMLInputElement>('.story input[type="text"]')
            .should("have.length", 24)
            .each(($input) => {
                const input = $input[0] as HTMLInputElement;
                const field = input.parentElement!;
                const document = input.ownerDocument;
                const window = document.defaultView!;
                const label = document.querySelector(
                    `label[for="${input.id}"]`,
                )!;
                const reference = document.createElement("span");
                field.append(reference);
                field.setAttribute("data-appearance-highlight", "hazard");
                const check = (state: string) => {
                    reference.style.backgroundColor = `var(--appearance-${state}-surface)`;
                    reference.style.color = `var(--appearance-${state}-glyphs)`;
                    expect(
                        window.getComputedStyle(field).backgroundColor,
                    ).to.equal(
                        window.getComputedStyle(reference).backgroundColor,
                    );
                    expect(window.getComputedStyle(input).color).to.equal(
                        window.getComputedStyle(reference).color,
                    );
                };
                for (const mode of ["light", "dark"]) {
                    field.setAttribute("data-appearance-mode", mode);
                    check("default");
                    const labelColor = window.getComputedStyle(label).color;
                    input.focus();
                    check("hover-focus");
                    expect(window.getComputedStyle(label).color).to.equal(
                        labelColor,
                    );
                    expect(
                        window.getComputedStyle(field).outlineWidth,
                    ).to.equal("2px");
                    field.setAttribute("data-highlighted", "true");
                    check("active-pressed");
                    field.setAttribute("data-disabled", "true");
                    input.disabled = true;
                    check("disabled");
                    expect(
                        window.getComputedStyle(field).outlineStyle,
                    ).to.equal("none");
                    field.removeAttribute("data-disabled");
                    field.removeAttribute("data-highlighted");
                    input.disabled = false;
                    input.blur();
                }
                reference.remove();
            });
    });

    it("supports saturation keyboard adjustment and ignores keys when disabled", () => {
        cy.visit(
            "/iframe.html?id=forms-colorrampsaturation--gallery&viewMode=story",
        );
        cy.get('[role="slider"]')
            .focus()
            .trigger("keydown", { key: "ArrowRight" })
            .should("have.attr", "aria-valuenow", "71");
        cy.window()
            .its("__STORYBOOK_PREVIEW__.channel")
            .invoke("emit", "updateStoryArgs", {
                storyId: "forms-colorrampsaturation--gallery",
                updatedArgs: {
                    disabled: true,
                },
            });
        cy.get('[role="slider"]')
            .should("have.attr", "aria-disabled", "true")
            .trigger("keydown", { key: "ArrowRight" })
            .should("have.attr", "aria-valuenow", "71");
    });
});
