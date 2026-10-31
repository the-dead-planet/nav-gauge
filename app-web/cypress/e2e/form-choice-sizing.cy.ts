import { themeSizes } from "@the-dead-planet/nav-gauge-ui-common/src/design-system/theme/tinkers";
import { cornerOptions } from "@the-dead-planet/nav-gauge-ui-common/src/design-system/tinkers";

describe("Form choice row sizing", () => {
    for (const control of ["checkbox", "radio"]) {
        it(`keeps ${control} and its row stable when the selection mark appears`, () => {
            cy.readFile<string>(
                `../ui/web/src/forms/${control}/${control}.module.css`,
            ).then((css) => {
                cy.document().then((document) => {
                    const stylesheet = document.createElement("style");
                    stylesheet.textContent = css;
                    document.head.appendChild(stylesheet);
                    for (const [size, metrics] of Object.entries(
                        themeSizes.control,
                    )) {
                        for (const [metric, value] of Object.entries(metrics)) {
                            const suffix = metric.replace(
                                /[A-Z]/g,
                                (letter) => `-${letter.toLowerCase()}`,
                            );
                            document.documentElement.style.setProperty(
                                `--size-control-${size}-${suffix}`,
                                `${value}px`,
                            );
                        }
                    }
                    document.documentElement.style.setProperty(
                        "--appearance-default-border-width",
                        "1px",
                    );
                    for (const [size, metrics] of Object.entries(
                        themeSizes.control,
                    )) {
                        for (const labelled of [false, true]) {
                            for (const corners of cornerOptions) {
                                const row = document.createElement("div");
                                row.innerHTML = `
                                <label class="${control} size-${size}">
                                    <input class="input" type="${control}" />
                                    <span class="box corners-${corners}"></span>
                                    ${labelled ? '<span class="label">Choice</span>' : ""}
                                </label>
                                <input type="text" aria-label="Neighbour" style="box-sizing:border-box;height:${metrics.height}px;vertical-align:middle" />
                            `;
                                document.body.appendChild(row);
                                const label = row.querySelector("label")!;
                                const box = row.querySelector(".box")!;
                                box.setAttribute(
                                    "style",
                                    "color: rgb(10, 20, 30)",
                                );
                                if (corners === "hexagon") {
                                    box.innerHTML =
                                        '<svg class="drawing" style="position:absolute;inset:0;width:100%;height:100%"><polygon class="paint" /></svg>';
                                }
                                const neighbour =
                                    row.querySelector('input[type="text"]')!;
                                const measure = () => ({
                                    controlHeight:
                                        label.getBoundingClientRect().height,
                                    controlWidth:
                                        label.getBoundingClientRect().width,
                                    controlTop:
                                        label.getBoundingClientRect().top,
                                    boxHeight:
                                        box.getBoundingClientRect().height,
                                    boxWidth: box.getBoundingClientRect().width,
                                    rowHeight:
                                        row.getBoundingClientRect().height,
                                    neighbourTop:
                                        neighbour.getBoundingClientRect().top,
                                });
                                const unchecked = measure();
                                expect(
                                    document.defaultView!.getComputedStyle(box)
                                        .borderRadius,
                                    `${control} corner shape`,
                                ).to.equal(
                                    corners === "circle" ? "50%" : "0px",
                                );
                                row.querySelector<HTMLInputElement>(
                                    `input[type="${control}"]`,
                                )!.checked = true;
                                box.insertAdjacentHTML(
                                    "beforeend",
                                    control === "checkbox"
                                        ? '<svg class="checkmark" viewBox="0 0 12 12" width="12" height="12"><path d="M2 6l3 3 5-5" /></svg>'
                                        : `<span class="marker">${corners === "hexagon" ? '<svg width="100%" height="100%"><polygon /></svg>' : ""}</span>`,
                                );
                                if (control === "radio") {
                                    const marker =
                                        box.querySelector(".marker")!;
                                    const markerStyle =
                                        document.defaultView!.getComputedStyle(
                                            marker,
                                        );
                                    if (corners === "hexagon") {
                                        expect(
                                            markerStyle.backgroundColor,
                                        ).to.equal("rgba(0, 0, 0, 0)");
                                        expect(
                                            document.defaultView!.getComputedStyle(
                                                marker.querySelector(
                                                    "polygon",
                                                )!,
                                            ).fill,
                                        ).to.equal("rgb(10, 20, 30)");
                                    } else {
                                        expect(
                                            markerStyle.borderRadius,
                                        ).to.equal(
                                            corners === "circle"
                                                ? "50%"
                                                : "0px",
                                        );
                                        expect(
                                            markerStyle.backgroundColor,
                                        ).to.equal("rgb(10, 20, 30)");
                                    }
                                }
                                const checked = measure();
                                const description = `${control} ${corners} ${size} ${labelled ? "labelled" : "unlabelled"}`;
                                expect(checked, description).to.deep.equal(
                                    unchecked,
                                );
                                expect(
                                    checked.controlHeight,
                                    description,
                                ).to.equal(metrics.height);
                                expect(checked.boxHeight, description).to.equal(
                                    metrics.height - metrics.gap,
                                );
                                expect(checked.boxWidth, description).to.equal(
                                    metrics.height - metrics.gap,
                                );
                                expect(
                                    checked.controlTop,
                                    description,
                                ).to.equal(checked.neighbourTop);
                                row.querySelector<HTMLInputElement>(
                                    `input[type="${control}"]`,
                                )!.checked = false;
                                box.querySelector(
                                    ".checkmark, .marker",
                                )!.remove();
                                expect(measure(), description).to.deep.equal(
                                    unchecked,
                                );
                                row.remove();
                            }
                        }
                    }
                });
            });
        });
    }
});
