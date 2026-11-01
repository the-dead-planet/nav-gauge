import {
    appearanceColorOptions,
    sizeOptions,
    surfaceVariantOptions,
} from "@the-dead-planet/nav-gauge-ui-common/src/design-system/tinkers";
import { themeSizes } from "@the-dead-planet/nav-gauge-ui-common/src/design-system/theme/tinkers";

describe("Themed scrollbars", () => {
    beforeEach(() => {
        cy.visit("/iframe.html?id=forms-textarea--gallery&viewMode=story");
        cy.get("textarea").should("exist");
    });

    it("uses each variant's glyph and surface paints across palettes and modes", () => {
        cy.document().then((document) => {
            const window = document.defaultView!;
            for (const mode of ["light", "dark"]) {
                for (const color of appearanceColorOptions) {
                    for (const variant of [
                        undefined,
                        ...surfaceVariantOptions,
                    ]) {
                        const owner = document.createElement("section");
                        owner.dataset.appearanceColor = color;
                        owner.dataset.appearanceMode = mode;
                        if (variant !== undefined) {
                            owner.dataset.appearanceVariant = variant;
                        }
                        owner.innerHTML = `
                            <div role="listbox" style="width:120px;height:60px;overflow:auto"><div style="width:400px;height:200px">Menu options</div></div>
                            <textarea wrap="off" aria-label="Scrollable text" style="width:120px;height:60px;overflow:auto"></textarea>
                            <span></span>
                        `;
                        document.body.appendChild(owner);
                        const textArea = owner.querySelector("textarea")!;
                        textArea.value = Array(10)
                            .fill("A".repeat(100))
                            .join("\n");
                        const swatch = owner.querySelector("span")!;
                        swatch.style.backgroundColor =
                            "var(--appearance-default-glyphs)";
                        const thumb =
                            window.getComputedStyle(swatch).backgroundColor;
                        swatch.style.backgroundColor =
                            "var(--appearance-default-surface)";
                        const track =
                            window.getComputedStyle(swatch).backgroundColor;
                        const description = `${mode} ${color} ${variant ?? "default"}`;

                        if (variant === undefined) {
                            swatch.style.backgroundColor = `var(--color-${color}-${mode === "light" ? 900 : 100})`;
                            expect(
                                thumb,
                                `${description} glyph palette`,
                            ).to.equal(
                                window.getComputedStyle(swatch).backgroundColor,
                            );
                        }

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
                                const computed =
                                    window.getComputedStyle(element);
                                expect(computed.scrollbarWidth).to.equal(
                                    "auto",
                                );
                                expect(
                                    computed.scrollbarColor,
                                    description,
                                ).to.equal(`${thumb} ${track}`);
                            } else {
                                const computed = window.getComputedStyle(
                                    element,
                                    "::-webkit-scrollbar-thumb",
                                );
                                expect(
                                    computed.backgroundColor,
                                    description,
                                ).to.equal(thumb);
                                expect(computed.borderRadius).to.equal("0px");
                                expect(
                                    window.getComputedStyle(
                                        element,
                                        "::-webkit-scrollbar-track",
                                    ).backgroundColor,
                                    description,
                                ).to.equal(track);
                            }
                        }

                        textArea.dataset.appearanceColor = "hazard";
                        textArea.dataset.appearanceVariant = "fill-inverse";
                        swatch.style.backgroundColor = `var(--color-hazard-${mode === "light" ? 900 : 100})`;
                        const nestedThumb =
                            window.getComputedStyle(swatch).backgroundColor;
                        const nestedColor = Cypress.isBrowser("firefox")
                            ? window.getComputedStyle(textArea).scrollbarColor
                            : window.getComputedStyle(
                                  textArea,
                                  "::-webkit-scrollbar-thumb",
                              ).backgroundColor;
                        expect(
                            nestedColor,
                            "nested appearance owner",
                        ).to.include(nestedThumb);
                        owner.remove();
                    }
                }
            }
        });
    });

    it("uses the selected control gap in Chromium, a small default, and native auto width in Firefox", () => {
        cy.document().then((document) => {
            const element = document.createElement("div");
            element.style.cssText = "width:120px;height:60px;overflow:auto";
            element.innerHTML =
                '<div style="width:400px;height:200px">Content</div>';
            document.body.appendChild(element);
            for (const size of [...sizeOptions, undefined]) {
                if (size === undefined) {
                    delete element.dataset.size;
                } else {
                    element.dataset.size = size;
                }
                if (Cypress.isBrowser("firefox")) {
                    expect(
                        document.defaultView!.getComputedStyle(element)
                            .scrollbarWidth,
                    ).to.equal("auto");
                } else {
                    const computed = document.defaultView!.getComputedStyle(
                        element,
                        "::-webkit-scrollbar",
                    );
                    const expected = `${themeSizes.control[size ?? "sm"].gap}px`;
                    expect(computed.width, size ?? "default").to.equal(
                        expected,
                    );
                    expect(computed.height, size ?? "default").to.equal(
                        expected,
                    );
                }
            }
            element.remove();
        });
    });
});
