import { Children, isValidElement, ReactNode, useState } from "react";
import { GridTemplateVariant } from "@ui";

export const getGridColumns = (
    children: ReactNode,
    cols: GridTemplateVariant,
    measurements: Readonly<Record<string, number>>,
) => {
    const columnCount = Number(cols.slice(cols.lastIndexOf("-") + 1));
    const equalColumns = cols.startsWith("equal-");
    const cells = Children.toArray(children).map((child, index) => ({
        key: isValidElement(child) ? String(child.key) : String(index),
        child,
    }));
    const columnWidths = Array.from({ length: columnCount }, (_, column) => {
        const widths = cells
            .filter((_, index) => index % columnCount === column)
            .map((cell) => measurements[cell.key]);
        return widths.every((width) => width !== undefined)
            ? Math.max(0, ...widths)
            : undefined;
    });
    const rows = Array.from(
        { length: Math.ceil(cells.length / columnCount) },
        (_, row) => {
            const rowCells = cells.slice(
                row * columnCount,
                (row + 1) * columnCount,
            );
            return {
                key: rowCells[0].key,
                cells: Array.from(
                    { length: columnCount },
                    (_, column) =>
                        rowCells[column] ?? {
                            key: `empty-${column}`,
                            child: null,
                        },
                ),
            };
        },
    );

    return { rows, columnWidths, equalColumns };
};

export const useGridColumns = (
    children: ReactNode,
    cols: GridTemplateVariant,
) => {
    const [measurements, setMeasurements] = useState<Record<string, number>>(
        {},
    );
    const measureCell = (key: string, width: number) => {
        setMeasurements((previous) =>
            previous[key] === width ? previous : { ...previous, [key]: width },
        );
    };

    return { ...getGridColumns(children, cols, measurements), measureCell };
};
