describe("Side tool panel scrolling", () => {
    beforeEach(() => {
        for (const file of [
            "src/layout/layout.module.css",
            "src/machine/machine.module.css",
        ]) {
            cy.readFile<string>(file).then((css) => {
                cy.document().then((document) => {
                    const stylesheet = document.createElement("style");
                    stylesheet.textContent = css;
                    document.head.appendChild(stylesheet);
                });
            });
        }
    });

    for (const placement of ["left", "right"]) {
        it(`bounds the ${placement} controls scroll area below the stationary header`, () => {
            cy.document().then((document) => {
                document.body.style.margin = "0";
                document.body.innerHTML = `
                    <div id="app" style="height:360px;width:900px;display:flex;flex-direction:column;overflow:hidden">
                        <div class="layout">
                            <header style="height:50px">Application header</header>
                            <main class="machine">
                                <div class="toolbar top"><div class="content">Top toolbar</div></div>
                                <aside class="toolbar ${placement}" style="width:320px">
                                    <div class="content">
                                        <nav class="content-header"><button>Panel selector</button></nav>
                                        <div class="component-container">
                                            <header class="component-header">Tool heading</header>
                                            <section class="component">
                                            <div class="component-content">
                                                <article style="height:1200px;display:flex;flex-direction:column">
                                                    <p>Long tool controls</p>
                                                    <button id="last-control" style="margin-top:auto">Last control</button>
                                                </article>
                                            </div>
                                            </section>
                                        </div>
                                    </div>
                                </aside>
                            </main>
                        </div>
                    </div>`;
            });

            for (const { height, width } of [
                { height: 360, width: 320 },
                { height: 240, width: 200 },
            ]) {
                cy.get("#app").invoke("css", "height", `${height}px`);
                cy.get(`.toolbar.${placement}`).invoke(
                    "css",
                    "width",
                    `${width}px`,
                );
                cy.get<HTMLElement>(".component").should(($content) => {
                    const content = $content[0];
                    const toolbar = content.closest(".toolbar")!;
                    const header = content.previousElementSibling!;
                    const bounds = content.getBoundingClientRect();
                    expect(bounds.bottom).to.be.at.most(height);
                    expect(bounds.bottom).to.be.at.most(
                        toolbar.getBoundingClientRect().bottom,
                    );
                    expect(bounds.top).to.be.at.least(
                        header.getBoundingClientRect().bottom,
                    );
                    expect(content.clientHeight).to.be.greaterThan(0);
                    expect(content.scrollHeight).to.be.greaterThan(
                        content.clientHeight,
                    );
                });
            }

            cy.get(".content-header").then(($rail) => {
                const railTop = $rail[0].getBoundingClientRect().top;
                cy.get(".component-header").then(($header) => {
                    const headerTop = $header[0].getBoundingClientRect().top;
                    cy.get(".component").scrollTo("bottom");
                    cy.get("#last-control").should("be.visible");
                    cy.get(".component-header").should(($currentHeader) => {
                        expect(
                            $currentHeader[0].getBoundingClientRect().top,
                        ).to.equal(headerTop);
                    });
                });
                cy.get(".content-header").should(($currentRail) => {
                    expect(
                        $currentRail[0].getBoundingClientRect().top,
                    ).to.equal(railTop);
                });
            });
            cy.get<HTMLElement>(
                ".toolbar > .content, .component-container",
            ).should(($content) => {
                for (const content of $content.toArray()) {
                    expect(content.scrollTop).to.equal(0);
                }
            });
            cy.get(".component-content > article").invoke(
                "css",
                "height",
                "20px",
            );
            cy.get<HTMLElement>(".component").should(($content) => {
                expect($content[0].scrollHeight).to.equal(
                    $content[0].clientHeight,
                );
            });
        });
    }
});
