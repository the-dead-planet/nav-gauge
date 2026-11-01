describe("Slider appearance", () => {
    it("renders the complete gallery with visible status-color thumbs and readable fill labels", () => {
        cy.visit("/iframe.html?id=forms-slider--gallery&viewMode=story");
        cy.get('input[type="range"]').should("have.length", 24);
        for (const color of [
            "primary",
            "secondary",
            "tertiary",
            "neutral",
            "glitch",
            "hazard",
            "secured",
            "intel",
        ]) {
            cy.get(
                `[data-appearance-color="${color}"][data-appearance-variant="fill"]`,
            ).then(($slider) => {
                const label = $slider.find("label")[0];
                const thumb = $slider.find(
                    '[aria-hidden="true"] > div:last-child',
                )[0];
                const window = label.ownerDocument.defaultView!;
                const labelColor = window.getComputedStyle(label).color;
                const thumbColor =
                    window.getComputedStyle(thumb).backgroundColor;
                expect(thumbColor).not.to.equal("rgba(0, 0, 0, 0)");
                expect(labelColor).not.to.equal(thumbColor);
            });
        }
    });

    it("keeps highlighted above focus and disabled above both without dimming", () => {
        cy.readFile<string>("src/forms/slider/slider.module.css").then(
            (css) => {
                cy.document().then((document) => {
                    const style = document.createElement("style");
                    style.textContent = css;
                    document.head.appendChild(style);
                    for (const [index, state] of [
                        "default",
                        "hover-focus",
                        "active-pressed",
                        "disabled",
                    ].entries()) {
                        for (const channel of ["surface", "border", "glyphs"]) {
                            document.documentElement.style.setProperty(
                                `--appearance-${state}-${channel}`,
                                `rgb(${(index + 1) * 10}, 0, 0)`,
                            );
                        }
                        document.documentElement.style.setProperty(
                            `--appearance-${state}-border-width`,
                            "1px",
                        );
                    }
                    document.documentElement.style.setProperty(
                        "--appearance-glow-color",
                        "rgb(0, 0, 255)",
                    );
                    document.body.innerHTML = `
                    <div id="slider" class="container" data-size="sm">
                        <label class="label" for="range">Position</label>
                        <div class="slider-wrapper" style="--track-complete:50%;width:300px;height:24px">
                            <div class="track"><div class="progress"></div><div class="thumb"></div></div>
                            <input id="range" class="slider" type="range" aria-label="Position" />
                        </div>
                    </div>
                `;
                });
            },
        );

        cy.get(".thumb").should(
            "have.css",
            "background-color",
            "rgb(10, 0, 0)",
        );
        cy.get("#range").focus();
        cy.get(".thumb").should(
            "have.css",
            "background-color",
            "rgb(20, 0, 0)",
        );
        cy.get(".label").should("have.css", "color", "rgb(20, 0, 0)");
        cy.get(".slider-wrapper").should("have.css", "outline-width", "2px");
        cy.get("#slider").invoke("attr", "data-highlighted", "true");
        cy.get(".thumb").should(
            "have.css",
            "background-color",
            "rgb(30, 0, 0)",
        );
        cy.get(".label").should("have.css", "color", "rgb(30, 0, 0)");
        cy.get(".progress").should(
            "have.css",
            "background-color",
            "rgb(30, 0, 0)",
        );
        cy.get("#slider").invoke(
            "css",
            "--appearance-active-pressed-glyphs-override",
            "rgb(50, 0, 0)",
        );
        cy.get(".label").should("have.css", "color", "rgb(50, 0, 0)");
        cy.get("#slider").invoke("attr", "data-disabled", "true");
        cy.get("#range").invoke("prop", "disabled", true);
        cy.get(".thumb").should(
            "have.css",
            "background-color",
            "rgb(40, 0, 0)",
        );
        cy.get(".label").should("have.css", "color", "rgb(40, 0, 0)");
        cy.get(".progress").should(
            "have.css",
            "background-color",
            "rgb(40, 0, 0)",
        );
        cy.get("#range").should("have.css", "cursor", "not-allowed");
        cy.get("#slider").should("have.css", "opacity", "1");
        cy.get(".slider-wrapper").should("have.css", "outline-width", "0px");
    });
});
