import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import { usePanelDimensions } from "../../../src/hud/usePanelDimensions";

const MeasuredPanel = () => {
    const { containerRef, headerRef, width, height, headerHeight } =
        usePanelDimensions<HTMLElement>(true);

    return createElement(
        "section",
        {
            ref: containerRef,
            "data-measured-width": width,
            "data-measured-height": height,
            style: {
                boxSizing: "border-box",
                width: "100%",
                padding: width < 400 ? 8 : 24,
            },
        },
        createElement(
            "div",
            {
                ref: headerRef,
                "data-measured-header-height": headerHeight,
            },
            "Panel heading",
        ),
    );
};

describe("Panel dimension observation", () => {
    let root: Root | undefined;

    afterEach(() => {
        root?.unmount();
        root = undefined;
    });

    it("settles measurement-dependent layout without ResizeObserver feedback errors", () => {
        cy.document().then((document) => {
            const container = document.createElement("div");
            container.id = "panel-dimensions-fixture";
            container.style.width = "600px";
            document.body.appendChild(container);
            root = createRoot(container);
            root.render(createElement(MeasuredPanel));
        });

        cy.get("[data-measured-width]").should(
            "have.attr",
            "data-measured-width",
            "600",
        );
        for (const width of [240, 600, 320, 520]) {
            cy.get("#panel-dimensions-fixture").invoke(
                "css",
                "width",
                `${width}px`,
            );
            cy.get<HTMLElement>("[data-measured-width]").should(($panel) => {
                const panel = $panel[0];
                const header = panel.firstElementChild as HTMLElement;
                expect(Number(panel.dataset.measuredWidth)).to.equal(width);
                expect(Number(panel.dataset.measuredHeight)).to.equal(
                    panel.offsetHeight,
                );
                expect(Number(header.dataset.measuredHeaderHeight)).to.equal(
                    header.offsetHeight,
                );
                expect(panel.style.padding).to.equal(
                    width < 400 ? "8px" : "24px",
                );
            });
        }
    });
});
