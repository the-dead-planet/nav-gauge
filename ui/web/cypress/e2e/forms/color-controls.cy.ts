describe("Color controls", () => {
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
