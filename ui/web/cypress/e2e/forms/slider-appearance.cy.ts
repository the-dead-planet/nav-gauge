describe("Slider appearance", () => {
    it("uses opaque track shades and thumb interaction paints across variants and modes", () => {
        cy.visit("/iframe.html?id=forms-slider--gallery&viewMode=story");
        cy.get("#theme-appearance-variables").should("exist");
        cy.get('input[type="range"]').should("have.length", 24);
        cy.get<HTMLInputElement>('.story [data-appearance-color="neutral"] input[type="range"]').should("have.length", 3).each(($input) => {
            const input = $input[0] as HTMLInputElement;
            const slider = $input[0].closest("[data-appearance-variant]")!;
            const track = slider.querySelector('[aria-hidden="true"]')!;
            const progress = track.firstElementChild!;
            const thumb = track.lastElementChild!;
            const label = slider.querySelector("label")!;
            const window = slider.ownerDocument.defaultView!;
            const reference = slider.ownerDocument.createElement("span");
            slider.setAttribute("data-appearance-highlight", "hazard");
            slider.setAttribute("data-glow", "glow");
            slider.append(reference);
            for (const mode of ["light", "dark"]) {
                slider.setAttribute("data-appearance-mode", mode);
                reference.style.backgroundColor = "var(--appearance-color-500)";
                expect(
                    window.getComputedStyle(progress).backgroundColor,
                ).to.equal(window.getComputedStyle(reference).backgroundColor);
                reference.style.backgroundColor = `var(--appearance-color-${mode === "light" ? 300 : 700})`;
                expect(
                    window.getComputedStyle(track).backgroundColor,
                    `${slider.getAttribute("data-appearance-color")} ${slider.getAttribute("data-appearance-variant")} ${mode}`,
                ).to.equal(window.getComputedStyle(reference).backgroundColor);
                expect(window.getComputedStyle(track).opacity).to.equal("1");
                expect(window.getComputedStyle(progress).opacity).to.equal("1");
                expect(window.getComputedStyle(thumb).boxShadow).to.equal(
                    "none",
                );
                const leftCap = window.getComputedStyle(progress, "::before");
                const rightCap = window.getComputedStyle(track, "::after");
                const trackThickness = parseFloat(
                    window.getComputedStyle(track).height,
                );
                for (const cap of [leftCap, rightCap]) {
                    expect(cap.content).not.to.equal("none");
                    expect(parseFloat(cap.width) * Math.SQRT2).to.be.closeTo(
                        trackThickness,
                        0.02,
                    );
                    expect(cap.height).to.equal(cap.width);
                }
                expect(leftCap.backgroundColor).to.equal(
                    window.getComputedStyle(progress).backgroundColor,
                );
                expect(rightCap.backgroundColor).to.equal(
                    window.getComputedStyle(track).backgroundColor,
                );
                const unfilledColor =
                    window.getComputedStyle(track).backgroundColor;
                const labelColor = window.getComputedStyle(label).color;
                input.focus();
                expect(input.matches(":focus-visible")).to.equal(true);
                for (const highlighted of [false, true]) {
                    if (highlighted) {
                        slider.setAttribute("data-highlighted", "true");
                    }
                    const thumbStyle = window.getComputedStyle(thumb);
                    const thumbPaint =
                        slider.getAttribute("data-appearance-variant") ===
                        "fill"
                            ? thumbStyle.backgroundColor
                            : thumbStyle.borderTopColor;
                    expect(
                        window.getComputedStyle(progress).backgroundColor,
                    ).to.equal(thumbPaint);
                    expect(
                        window.getComputedStyle(track).backgroundColor,
                    ).to.equal(unfilledColor);
                    expect(
                        window.getComputedStyle(thumb).boxShadow,
                    ).not.to.equal("none");
                    expect(
                        window.getComputedStyle(progress, "::before")
                            .backgroundColor,
                    ).to.equal(thumbPaint);
                    expect(
                        window.getComputedStyle(track, "::after")
                            .backgroundColor,
                    ).to.equal(unfilledColor);
                    expect(window.getComputedStyle(label).color).to.equal(
                        labelColor,
                    );
                }
                slider.setAttribute("data-disabled", "true");
                input.disabled = true;
                reference.style.backgroundColor = "var(--appearance-color-500)";
                expect(
                    window.getComputedStyle(progress).backgroundColor,
                ).to.equal(window.getComputedStyle(reference).backgroundColor);
                expect(window.getComputedStyle(track).backgroundColor).to.equal(
                    unfilledColor,
                );
                expect(window.getComputedStyle(thumb).boxShadow).to.equal(
                    "none",
                );
                slider.removeAttribute("data-disabled");
                slider.removeAttribute("data-highlighted");
                input.disabled = false;
                input.blur();
            }
            reference.remove();
        });
    });

    it("runs the animated thumb glow once and resets it when inactive", () => {
        cy.visit("/iframe.html?id=forms-slider--gallery&viewMode=story");
        cy.get('input[type="range"]')
            .first()
            .closest("[data-appearance-variant]")
            .invoke("attr", "data-glow", "animate-borders-glow")
            .invoke("attr", "data-highlighted", "true")
            .then(async ($slider) => {
                const thumb = $slider[0].querySelector(
                    '[aria-hidden="true"]',
                )!.lastElementChild!;
                const animation = thumb.getAnimations()[0];
                expect(animation).to.exist;
                expect(animation.effect!.getTiming().iterations).to.equal(1);
                expect(animation.effect!.getTiming().duration).to.equal(400);
                await animation.finished;
                expect(animation.playState).to.equal("finished");
                const window = thumb.ownerDocument.defaultView!;
                expect(window.getComputedStyle(thumb).boxShadow).to.include(
                    "1px 1px 4px",
                );
                $slider[0].removeAttribute("data-highlighted");
                expect(thumb.getAnimations()).to.have.length(0);
                expect(window.getComputedStyle(thumb).boxShadow).to.equal(
                    "none",
                );
            });
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
                    document.documentElement.style.colorScheme = "light";
                    document.documentElement.style.setProperty(
                        "--size-control-thumb-size",
                        "14px",
                    );
                    document.documentElement.style.setProperty(
                        "--size-control-track-thickness",
                        "6px",
                    );
                    for (const shade of [300, 500, 700]) {
                        document.documentElement.style.setProperty(
                            `--appearance-color-${shade}`,
                            `rgb(0, ${shade / 10}, 0)`,
                        );
                        document.documentElement.style.setProperty(
                            `--appearance-highlight-${shade}`,
                            `rgb(0, 0, ${shade / 10})`,
                        );
                    }
                    document.body.innerHTML = `
                    <div id="slider" class="container" data-size="sm" data-glow="glow">
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
        cy.get(".thumb").should("have.css", "box-shadow", "none");
        cy.get(".progress").should(
            "have.css",
            "background-color",
            "rgb(0, 50, 0)",
        );
        cy.get(".track").should(
            "have.css",
            "background-color",
            "rgb(0, 30, 0)",
        );
        cy.get("#range").focus();
        cy.get(".thumb").should(
            "have.css",
            "background-color",
            "rgb(20, 0, 0)",
        );
        cy.get(".thumb").should("not.have.css", "box-shadow", "none");
        cy.get(".track").should("have.css", "box-shadow", "none");
        cy.get(".progress").should(
            "have.css",
            "background-color",
            "rgb(20, 0, 0)",
        );
        cy.get(".track").should(
            "have.css",
            "background-color",
            "rgb(0, 30, 0)",
        );
        cy.get(".slider-wrapper").should("have.css", "outline-width", "2px");
        cy.get("#slider").invoke("attr", "data-highlighted", "true");
        cy.get(".thumb").should(
            "have.css",
            "background-color",
            "rgb(30, 0, 0)",
        );
        cy.get(".thumb").should("not.have.css", "box-shadow", "none");
        cy.get(".progress").should(
            "have.css",
            "background-color",
            "rgb(30, 0, 0)",
        );
        cy.get("#slider").invoke("attr", "data-disabled", "true");
        cy.get("#range").invoke("prop", "disabled", true);
        cy.get(".thumb").should(
            "have.css",
            "background-color",
            "rgb(40, 0, 0)",
        );
        cy.get(".thumb").should("have.css", "box-shadow", "none");
        cy.get(".progress").should(
            "have.css",
            "background-color",
            "rgb(0, 50, 0)",
        );
        cy.get("#range").should("have.css", "cursor", "not-allowed");
        cy.get("#slider").should("have.css", "opacity", "1");
        cy.get(".slider-wrapper").should("have.css", "outline-style", "none");
        cy.get(".track").should(
            "have.css",
            "background-color",
            "rgb(0, 30, 0)",
        );
        cy.document().then((document) => {
            document.documentElement.style.colorScheme = "dark";
        });
        cy.get("#slider").invoke("attr", "data-appearance-mode", "dark");
        cy.get(".track").should(
            "have.css",
            "background-color",
            "rgb(0, 70, 0)",
        );
        cy.get("#slider").invoke("removeAttr", "data-disabled");
        cy.get("#range").invoke("prop", "disabled", false);
        cy.get(".progress").should(
            "have.css",
            "background-color",
            "rgb(30, 0, 0)",
        );
        cy.get(".track").should(
            "have.css",
            "background-color",
            "rgb(0, 70, 0)",
        );
    });

    it("keeps the range and extracted number/step controls synchronized", () => {
        cy.visit("/iframe.html?id=forms-slider--gallery&viewMode=story");
        cy.get('input[type="range"]').should("have.length", 24);
        cy.window()
            .its("__STORYBOOK_PREVIEW__.channel")
            .invoke("emit", "updateStoryArgs", {
                storyId: "forms-slider--gallery",
                updatedArgs: {
                    showNumberInput: true,
                    showStepControls: true,
                },
            });
        cy.get('input[type="range"]')
            .first()
            .closest("[data-appearance-variant]")
            .as("slider");
        cy.get("@slider")
            .find('input[type="number"]')
            .should("have.value", "50")
            .type("{selectall}75")
            .should("have.value", "75");
        cy.get("@slider")
            .find('input[type="range"]')
            .should("have.value", "75");
        cy.get("@slider").find('button[aria-label="Slider (+)"]').click();
        cy.get("@slider")
            .find('input[type="range"]')
            .should("have.value", "76");
        cy.get("@slider")
            .find('input[type="number"]')
            .should("have.value", "76");
    });
});
