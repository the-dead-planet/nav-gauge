import type { FieldsetProps } from "@the-dead-planet/nav-gauge-ui-common/src/forms/fieldset/model";

const visitFieldset = (
    variant: string,
    color = "glitch",
    args: Partial<FieldsetProps> = {},
) => {
    cy.visit("/iframe.html?id=forms-fieldset--gallery&viewMode=story");
    cy.get("fieldset").should("exist");
    cy.window()
        .its("__STORYBOOK_PREVIEW__.channel")
        .invoke("emit", "updateStoryArgs", {
            storyId: "forms-fieldset--gallery",
            updatedArgs: args,
        });
    cy.get(
        `div[data-appearance-variant="${variant}"][data-appearance-color="${color}"] > div > fieldset`,
    )
        .first()
        .parent()
        .parent()
        .as("panel");
    cy.get("@panel").find("legend button").as("disclosure");
};

describe("Fieldset", () => {
    it("uses one compact ghost disclosure positioned above the frame", () => {
        visitFieldset("fill", "secured");
        cy.get("@disclosure")
            .should("have.attr", "data-appearance-variant", "ghost")
            .and("have.css", "padding-left", "0px")
            .and("have.css", "padding-right", "0px")
            .and("have.css", "cursor", "pointer");
        cy.get("@disclosure").find("svg").should("be.visible");
        cy.get("@disclosure")
            .contains("span", "Fieldset")
            .should("have.css", "cursor", "pointer");
        cy.get("@panel").then(($panel) => {
            const frame = $panel[0].getBoundingClientRect();
            const button = $panel[0]
                .querySelector("button")!
                .getBoundingClientRect();
            const chevron = $panel[0]
                .querySelector("button svg")!
                .getBoundingClientRect();
            expect(chevron.bottom).to.be.closeTo(frame.top, 1);
            expect(button.left - frame.left).to.be.at.most(8);
        });
    });

    it("uses a chamfered SVG and an accessible disclosure for caption and icon", () => {
        visitFieldset("outline", "glitch", { highlightColor: "intel" });
        cy.get("@panel").find("fieldset").should("be.visible");
        cy.get("@panel")
            .find("svg polygon")
            .should("have.attr", "points")
            .then((points) => {
                expect(String(points).trim().split(/\s+/)).to.have.length(8);
            });
        cy.get("@disclosure")
            .focus()
            .should("have.css", "outline-style", "solid");
        cy.get("@disclosure").should("have.attr", "aria-expanded", "true");
        cy.get("@disclosure").contains("span", "Fieldset").click();
        cy.get("@disclosure")
            .should("have.attr", "aria-expanded", "false")
            .then(($button) => {
                cy.get(`[id="${$button.attr("aria-controls")}"]`).should(
                    "not.be.visible",
                );
            });
        cy.get("@disclosure").click("left");
        cy.get("@disclosure").should("have.attr", "aria-expanded", "true");
    });

    it("keeps disabled disclosure above hover and highlighted states", () => {
        visitFieldset("outline", "glitch", {
            highlighted: true,
            disabled: true,
        });
        cy.get("@disclosure")
            .should("be.disabled")
            .and("have.attr", "aria-expanded", "true")
            .and("have.css", "cursor", "not-allowed");
        cy.get("@disclosure")
            .contains("span", "Fieldset")
            .should("have.css", "cursor", "not-allowed");
    });

    it("uses a blurred inner shadow and highlight for inset surfaces", () => {
        visitFieldset("inset");
        cy.get("@panel").children("svg").as("drawing");
        cy.get("@drawing")
            .find("filter feGaussianBlur")
            .should("have.attr", "stdDeviation", "2");
        cy.get("@drawing")
            .children("polygon")
            .should("have.attr", "filter")
            .and("match", /^url\(#.+\)$/);
        cy.get("@drawing")
            .find("filter feFlood")
            .should("have.length", 2)
            .each(($paint) => {
                expect($paint.css("flood-color")).not.to.equal(
                    "rgba(0, 0, 0, 0)",
                );
            });
    });

    it("updates the SVG frame in the same resize delivery as expansion and collapse", () => {
        visitFieldset("fill-inverse");
        cy.get("@panel").children("svg").should("exist");
        for (const expanded of [false, true]) {
            cy.get<JQuery<HTMLElement>>("@panel").then(
                ($panel) =>
                    new Cypress.Promise<void>((resolve) => {
                        const panel = $panel[0];
                        const window = panel.ownerDocument.defaultView!;
                        const observer = new window.ResizeObserver(() => {
                            observer.disconnect();
                            const drawing =
                                panel.querySelector<SVGSVGElement>(
                                    ":scope > svg",
                                )!;
                            expect(drawing.viewBox.baseVal.height).to.equal(
                                panel.offsetHeight,
                            );
                            expect(drawing.viewBox.baseVal.width).to.equal(
                                panel.offsetWidth,
                            );
                            window.requestAnimationFrame(() => resolve());
                        });
                        observer.observe(panel);
                        panel.querySelector("button")!.click();
                    }),
            );
            cy.get("@disclosure").should(
                "have.attr",
                "aria-expanded",
                String(expanded),
            );
        }
    });
});
