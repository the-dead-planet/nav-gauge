describe("Animated border glow", () => {
    it("runs the compiled Button sweep once and retains its final glow", () => {
        cy.visit("/iframe.html?id=gizmos-button--gallery&viewMode=story");
        cy.get("button[data-appearance-variant]")
            .first()
            .invoke("attr", "data-glow", "animate-borders-glow")
            .invoke("attr", "data-highlighted", "true")
            .should(($element) => {
                const style =
                    $element[0].ownerDocument.defaultView!.getComputedStyle(
                        $element[0],
                        "::after",
                    );
                expect(style.animationDuration).to.equal("0.4s");
                expect(style.animationIterationCount).to.equal("1");
                expect(style.animationFillMode).to.equal("forwards");
            })
            .then(async ($element) => {
                const animations: Animation[] = $element[0].getAnimations({
                    subtree: true,
                });
                expect(animations).not.to.be.empty;
                await Promise.all(
                    animations.map((animation) => animation.finished),
                );
                for (const animation of animations) {
                    expect(animation.playState).to.equal("finished");
                }
                const style =
                    $element[0].ownerDocument.defaultView!.getComputedStyle(
                        $element[0],
                        "::after",
                    );
                expect(style.boxShadow).to.include("1px 1px 4px");
            });
    });

    it("reveals outlines once, resets after interaction, and respects disabled and reduced motion", () => {
        cy.readFile<string>("src/hud/surface.module.css").then((css) => {
            cy.document().then((document) => {
                const style = document.createElement("style");
                style.textContent = css;
                document.head.appendChild(style);
                document.documentElement.style.setProperty(
                    "--appearance-glow-color",
                    "rgb(0, 255, 255)",
                );
                document.body.innerHTML = `
                    <button id="square" class="surface rectangle" data-glow="animate-borders-glow" style="width:150px;height:40px">Square</button>
                    <button id="circle" class="surface rectangle" data-glow="animate-borders-glow" style="width:40px;height:40px;border-radius:50%">Circle</button>
                    <section id="hexagon" class="surface" data-glow="animate-borders-glow">
                        <svg class="drawing" viewBox="0 0 100 100"><polygon class="glow" pathLength="300" points="25,0 75,0 100,50 75,100 25,100 0,50" /></svg>
                    </section>
                `;
            });
        });

        for (const id of ["square", "circle", "hexagon"]) {
            cy.get(`#${id}`).invoke("attr", "data-highlighted", "true");
            cy.get(`#${id}`).then(async ($element) => {
                const animations = $element[0].getAnimations({ subtree: true });
                expect(animations).to.have.length(1);
                expect(animations[0].effect!.getTiming().iterations).to.equal(
                    1,
                );
                await animations[0].finished;
                expect(animations[0].playState).to.equal("finished");
            });
            if (id === "hexagon") {
                cy.get("#hexagon .glow").should(
                    "have.css",
                    "stroke-dasharray",
                    "300px, 0px",
                );
                cy.get("#hexagon .glow").should("have.css", "opacity", "1");
            } else {
                cy.get(`#${id}`).should(($element) => {
                    const style =
                        $element[0].ownerDocument.defaultView!.getComputedStyle(
                            $element[0],
                            "::after",
                        );
                    expect(style.boxShadow).to.include("1px 1px 4px");
                    expect(style.borderRadius).to.equal(
                        id === "circle" ? "50%" : "0px",
                    );
                });
            }
            cy.get(`#${id}`).invoke("removeAttr", "data-highlighted");
            cy.get(`#${id}`).should(($element) => {
                expect(
                    $element[0].getAnimations({ subtree: true }),
                ).to.have.length(0);
            });
            cy.get(`#${id}`).invoke("attr", "data-disabled", "true");
            cy.get(`#${id}`).invoke("attr", "data-highlighted", "true");
            cy.get(`#${id}`).should(($element) => {
                expect(
                    $element[0].getAnimations({ subtree: true }),
                ).to.have.length(0);
            });
        }
        cy.get("#hexagon .glow").should("have.css", "opacity", "0");

        cy.document().then((document) => {
            for (const sheet of document.styleSheets) {
                for (const rule of sheet.cssRules) {
                    if (
                        rule.type === 4 &&
                        (rule as CSSMediaRule).conditionText.includes(
                            "prefers-reduced-motion",
                        )
                    ) {
                        (rule as CSSMediaRule).media.mediaText = "not all";
                    }
                }
            }
        });
        cy.get("[data-disabled]").invoke("removeAttr", "data-disabled");
        cy.get("#square").should(($element) => {
            const style =
                $element[0].ownerDocument.defaultView!.getComputedStyle(
                    $element[0],
                    "::after",
                );
            expect(style.animationName).to.equal("none");
            expect(style.boxShadow).not.to.equal("none");
        });
        cy.get("#hexagon .glow").should("have.css", "animation-name", "none");
        cy.get("#hexagon .glow").should("have.css", "stroke-dasharray", "none");
        cy.get("#hexagon .glow").should("have.css", "opacity", "1");
    });
});
