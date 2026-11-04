describe("Form labels", () => {
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
