import { appearanceColorOptions } from "@the-dead-planet/nav-gauge-ui-common/src/design-system/tinkers";

describe("Themed scrollbars", () => {
    it("uses the nearest appearance palette for horizontal and vertical scrolling in both modes", () => {
        cy.visit("/iframe.html?id=forms-textarea--gallery&viewMode=story");
        cy.get("textarea").should("exist");
        cy.document().then((document) => {
            const window = document.defaultView!;
            for (const mode of ["light", "dark"]) {
                for (const color of appearanceColorOptions) {
                    const owner = document.createElement("section");
                    owner.dataset.appearanceColor = color;
                    owner.dataset.appearanceMode = mode;
                    owner.innerHTML = `
                        <div role="listbox" style="width:120px;height:60px;overflow:auto"><div style="width:400px;height:200px">Menu options</div></div>
                        <textarea wrap="off" aria-label="Scrollable text" style="width:120px;height:60px;overflow:auto"></textarea>
                        <span></span>
                    `;
                    document.body.appendChild(owner);
                    const textArea = owner.querySelector("textarea")!;
                    textArea.value = Array(10).fill("A".repeat(100)).join("\n");
                    const swatch = owner.querySelector("span")!;
                    swatch.style.backgroundColor = `var(--color-${color}-500)`;
                    const thumb =
                        window.getComputedStyle(swatch).backgroundColor;
                    swatch.style.backgroundColor = `rgb(from var(--color-${color}-${mode === "light" ? 200 : 800}) r g b / 0.7)`;
                    const track =
                        window.getComputedStyle(swatch).backgroundColor;

                    for (const element of [
                        owner.querySelector("[role=listbox]")!,
                        textArea,
                    ]) {
                        expect(element.scrollHeight).to.be.greaterThan(
                            element.clientHeight,
                        );
                        expect(element.scrollWidth).to.be.greaterThan(
                            element.clientWidth,
                        );
                        if (Cypress.isBrowser("firefox")) {
                            const computed = window.getComputedStyle(element);
                            expect(computed.scrollbarWidth).to.equal("thin");
                            expect(
                                computed.scrollbarColor,
                                `${mode} ${color}`,
                            ).to.equal(`${thumb} ${track}`);
                        } else {
                            const scrollbar = window.getComputedStyle(
                                element,
                                "::-webkit-scrollbar",
                            );
                            expect(scrollbar.width).to.equal("6px");
                            expect(scrollbar.height).to.equal("6px");
                            expect(
                                window.getComputedStyle(
                                    element,
                                    "::-webkit-scrollbar-thumb",
                                ).backgroundColor,
                                `${mode} ${color}`,
                            ).to.equal(thumb);
                            expect(
                                window.getComputedStyle(
                                    element,
                                    "::-webkit-scrollbar-track",
                                ).backgroundColor,
                            ).to.equal(track);
                        }
                    }

                    textArea.dataset.appearanceColor = "hazard";
                    swatch.style.backgroundColor = "var(--color-hazard-500)";
                    const nestedThumb =
                        window.getComputedStyle(swatch).backgroundColor;
                    const nestedColor = Cypress.isBrowser("firefox")
                        ? window.getComputedStyle(textArea).scrollbarColor
                        : window.getComputedStyle(
                              textArea,
                              "::-webkit-scrollbar-thumb",
                          ).backgroundColor;
                    expect(nestedColor, "nested appearance owner").to.include(
                        nestedThumb,
                    );
                    owner.remove();
                }
            }
        });
    });
});
