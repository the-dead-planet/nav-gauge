import { themeSizes } from "@the-dead-planet/nav-gauge-ui-common/src/design-system/theme/tinkers";

describe("Text field alignment", () => {
    it("aligns the first textarea row with a text input at every size, including multiline content", () => {
        cy.readFile<string>(
            "src/forms/text-input/text-input.module.css",
        ).then((inputCss) => {
            cy.readFile<string>(
                "src/forms/text-area/text-area.module.css",
            ).then((textAreaCss) => {
                cy.document().then((document) => {
                    const stylesheet = document.createElement("style");
                    stylesheet.textContent = `#text-input { ${inputCss} } #text-area { ${textAreaCss} }`;
                    document.head.appendChild(stylesheet);

                    for (const [size, metrics] of Object.entries(
                        themeSizes.control,
                    )) {
                        for (const borderWidth of [0, 1]) {
                            const row = document.createElement("div");
                            row.style.cssText =
                                "display:flex;align-items:flex-start;--font-default:Arial;--appearance-default-border:black";
                            row.style.setProperty(
                                "--appearance-default-border-width",
                                `${borderWidth}px`,
                            );
                            for (const [metric, value] of Object.entries(
                                metrics,
                            )) {
                                const property = metric.replace(
                                    /[A-Z]/g,
                                    (letter) => `-${letter.toLowerCase()}`,
                                );
                                row.style.setProperty(
                                    `--size-control-${property}`,
                                    `${value}px`,
                                );
                            }
                            row.innerHTML = `
                                <section id="text-input"><div class="container"><div class="field"><input class="input" value="First row" /></div></div></section>
                                <section id="text-area"><div class="container"><div class="field"><textarea class="textarea" rows="1">First row</textarea></div></div></section>
                            `;
                            document.body.appendChild(row);
                            const input = row.querySelector("input")!;
                            const textArea = row.querySelector("textarea")!;
                            const probe = document.createElement("div");
                            probe.style.font =
                                document.defaultView!.getComputedStyle(
                                    textArea,
                                ).font;
                            probe.style.height = "1lh";
                            row.appendChild(probe);
                            const lineHeight =
                                probe.getBoundingClientRect().height;

                            for (const rows of [1, 3]) {
                                textArea.rows = rows;
                                const inputCenter =
                                    input.getBoundingClientRect().top +
                                    input.getBoundingClientRect().height / 2;
                                const textAreaStyle =
                                    document.defaultView!.getComputedStyle(
                                        textArea,
                                    );
                                const firstRowCenter =
                                    textArea.getBoundingClientRect().top +
                                    Number.parseFloat(
                                        textAreaStyle.paddingTop,
                                    ) +
                                    lineHeight / 2;
                                expect(
                                    firstRowCenter,
                                    `${size}, ${borderWidth}px border, ${rows} rows`,
                                ).to.be.closeTo(inputCenter, 0.5);
                                const fieldHeight =
                                    textArea.parentElement!.getBoundingClientRect()
                                        .height;
                                if (rows === 1) {
                                    expect(
                                        fieldHeight,
                                        `${size} minimum height`,
                                    ).to.equal(metrics.height);
                                } else {
                                    expect(
                                        fieldHeight,
                                        `${size} multiline height`,
                                    ).to.be.greaterThan(metrics.height);
                                }
                            }
                            row.remove();
                        }
                    }
                    stylesheet.remove();
                });
            });
        });
    });
});
