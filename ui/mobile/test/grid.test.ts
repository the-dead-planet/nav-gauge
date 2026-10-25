import { expect } from "chai";
import { createElement } from "react";
import { getGridColumns } from "../src/chassis/grid/useGridColumns";

describe("Mobile Grid columns", () => {
    const children = ["a", "b", "c", "d", "e"].map((key) =>
        createElement("cell", { key }),
    );

    it("keeps incomplete rows on the same column tracks and preserves child keys", () => {
        const { rows, equalColumns } = getGridColumns(children, "equal-3", {});
        expect(equalColumns).to.equal(true);
        expect(rows.map((row) => row.cells.length)).to.deep.equal([3, 3]);
        expect(rows[1].cells[2].child).to.equal(null);
        expect(
            getGridColumns([children[2], children[0]], "equal-2", {}).rows[0]
                .cells[0].key,
        ).to.equal(rows[0].cells[2].key);
    });

    it("shares intrinsic column widths across rows and drops removed cells from sizing", () => {
        const initial = getGridColumns(children, "max-content-2", {});
        expect(initial.columnWidths).to.deep.equal([undefined, undefined]);
        const cells = initial.rows
            .flatMap((row) => row.cells)
            .filter((cell) => cell.child !== null);
        const measurements = Object.fromEntries(
            cells.map((cell, index) => [cell.key, [40, 30, 90, 60, 20][index]]),
        );
        expect(
            getGridColumns(children, "max-content-2", measurements)
                .columnWidths,
        ).to.deep.equal([90, 60]);
        expect(
            getGridColumns(children.slice(0, 2), "max-content-2", measurements)
                .columnWidths,
        ).to.deep.equal([40, 30]);
        expect(
            getGridColumns(children, "max-content-3", measurements)
                .columnWidths,
        ).to.deep.equal([60, 30, 90]);
    });
});
