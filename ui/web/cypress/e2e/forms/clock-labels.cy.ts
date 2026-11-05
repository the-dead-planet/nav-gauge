describe("Form labels", () => {
    it("keeps duration fields beside the dial when space permits and wraps them without overflow", () => {
        const storyId = "forms-clockdurationinput--gallery";
        cy.visit(`/iframe.html?id=${storyId}&viewMode=story`);
        cy.get(".story table").should("exist");
        cy.window()
            .its("__STORYBOOK_PREVIEW__.channel")
            .invoke("emit", "updateStoryArgs", {
                storyId,
                updatedArgs: {
                    showNumberInput: true,
                    showStepControls: true,
                    ariaLabel: "Duration",
                },
            });
        cy.get('input[aria-label="Duration (minutes)"]').should(
            "have.length",
            24,
        );
        cy.get('input[aria-label="Duration"]')
            .first()
            .closest("[data-size]")
            .as("duration");
        cy.get("@duration")
            .invoke("css", "width", "320px")
            .should(($owner) => {
                const owner = $owner[0];
                const row = owner.querySelector('[class*="control-row"]')!;
                const dial = row.firstElementChild!.getBoundingClientRect();
                const fields = row.lastElementChild!;
                const rectangle = fields.getBoundingClientRect();
                expect(rectangle.left).to.be.greaterThan(dial.right);
                expect(rectangle.top + rectangle.height / 2).to.be.closeTo(
                    dial.top + dial.height / 2,
                    1,
                );
                expect(rectangle.right).to.be.at.most(
                    owner.getBoundingClientRect().right,
                );
                for (const input of fields.querySelectorAll("input")) {
                    expect(
                        input
                            .closest("[data-appearance-variant]")!
                            .getBoundingClientRect().width,
                    ).to.equal(80);
                }
            });
        cy.get("@duration")
            .invoke("css", "width", "240px")
            .should(($owner) => {
                const row = $owner[0].querySelector('[class*="control-row"]')!;
                expect(
                    row.lastElementChild!.getBoundingClientRect().top,
                ).to.be.at.least(
                    row.firstElementChild!.getBoundingClientRect().bottom,
                );
                expect($owner[0].scrollWidth).to.be.at.most(240);
            });
    });

    it("converts the editable clock number field into its configured time unit", () => {
        const storyId = "forms-clockinput--gallery";
        cy.visit(`/iframe.html?id=${storyId}&viewMode=story`);
        cy.get(".story table").should("exist");
        cy.window()
            .its("__STORYBOOK_PREVIEW__.channel")
            .invoke("emit", "updateStoryArgs", {
                storyId,
                updatedArgs: {
                    value: 30,
                    min: 0,
                    max: 60,
                    step: 6,
                    showNumberInput: true,
                    numberInputScale: 6,
                    numberInputUnit: "s",
                    ariaLabel: "Pause",
                },
            });
        cy.get('input[aria-label="Pause (#)"]')
            .first()
            .should("have.value", "5")
            .and("have.attr", "max", "10")
            .and("have.attr", "step", "1");
        cy.get('input[aria-label="Pause (#)"]').first().type("{selectall}7");
        cy.get('input[type="range"]').first().should("have.value", "42");
        cy.get('input[aria-label="Pause (#)"]')
            .first()
            .should("have.value", "7");
    });
    for (const component of [
        "clockinput",
        "clocksliceinput",
        "clockdurationinput",
    ]) {
        it(`${component} Gallery labels own typography appearance independently of the dial`, () => {
            cy.visit(
                `/iframe.html?id=forms-${component}--gallery&viewMode=story&args=highlightColor:hazard;label:Clock`,
            );
            cy.get(".story table").should("exist");
            cy.window()
                .its("__STORYBOOK_PREVIEW__.channel")
                .invoke("emit", "updateStoryArgs", {
                    storyId: `forms-${component}--gallery`,
                    updatedArgs: { label: "Clock", highlightColor: "hazard" },
                });
            cy.get("label[for]")
                .should("have.length", 24)
                .each(($label) => {
                    const label = $label[0];
                    const owner = label.closest("[data-size]")!;
                    const input =
                        owner.querySelector<HTMLInputElement>("input")!;
                    const window = label.ownerDocument.defaultView!;
                    expect(
                        label.getAttribute("data-appearance-variant"),
                    ).to.equal("default");
                    const baseline = window.getComputedStyle(label);
                    const color = baseline.color;
                    const fontWeight = baseline.fontWeight;
                    input.focus();
                    for (const dragging of [false, true]) {
                        owner.setAttribute("data-dragging", String(dragging));
                        expect(window.getComputedStyle(label).color).to.equal(
                            color,
                        );
                        expect(
                            window.getComputedStyle(label).fontWeight,
                        ).to.equal(fontWeight);
                    }
                    input.blur();
                    owner.setAttribute("data-dragging", "false");
                });
        });
    }
    for (const component of ["checkbox", "radio"]) {
        it(`${component} Gallery captions use typography while only the box follows interaction state`, () => {
            cy.visit(
                `/iframe.html?id=forms-${component}--gallery&viewMode=story&args=highlightColor:hazard`,
            );
            cy.get<HTMLLabelElement>("label[data-size]")
                .should("have.length", 72)
                .each(($label) => {
                    const label = $label[0];
                    const caption = label.lastElementChild!;
                    const input = label.querySelector("input")!;
                    const box = label.querySelector('[aria-hidden="true"]')!;
                    const window = label.ownerDocument.defaultView!;
                    const reference = label.ownerDocument.createElement("span");
                    box.append(reference);
                    const color = window.getComputedStyle(caption).color;
                    input.focus();
                    expect(window.getComputedStyle(caption).color).to.equal(
                        color,
                    );
                    reference.style.backgroundColor =
                        "var(--appearance-hover-focus-surface)";
                    if (!box.querySelector("polygon")) {
                        expect(
                            window.getComputedStyle(box).backgroundColor,
                        ).to.equal(
                            window.getComputedStyle(reference).backgroundColor,
                        );
                    }
                    expect(label.querySelectorAll("label")).to.have.length(0);
                    input.blur();
                    reference.remove();
                });
            cy.window()
                .its("__STORYBOOK_PREVIEW__.channel")
                .invoke("emit", "updateStoryArgs", {
                    storyId: `forms-${component}--gallery`,
                    updatedArgs: { disabled: true, highlighted: true },
                });
            cy.get("label[data-size]")
                .first()
                .should("have.attr", "data-disabled", "true");
            cy.get<HTMLLabelElement>("label[data-size]")
                .should("have.length", 72)
                .each(($label) => {
                    const label = $label[0];
                    const caption = label.lastElementChild!;
                    const reference = label.ownerDocument.createElement("span");
                    label.append(reference);
                    reference.style.color = "var(--appearance-disabled-glyphs)";
                    const window = label.ownerDocument.defaultView!;
                    expect(window.getComputedStyle(caption).color).to.equal(
                        window.getComputedStyle(reference).color,
                    );
                    expect(label.querySelector("input")!.disabled).to.equal(
                        true,
                    );
                    reference.remove();
                });
        });
    }
});
