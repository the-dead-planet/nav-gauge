import type { SizeVariant } from "../../design-system/model";
import { DEFAULT_SIZE } from "../../design-system/tinkers";

const cornerDepths: Record<SizeVariant, number> = {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
};

export const getOctagonalGeometry = (
    width: number,
    height: number,
    size: SizeVariant = DEFAULT_SIZE,
    inset = 0,
    regular = false,
) => {
    const extent = Math.min(width, height);
    const left = inset + (regular ? (width - extent) / 2 : 0);
    const top = inset + (regular ? (height - extent) / 2 : 0);
    const right = width - left;
    const bottom = height - top;
    const depth = regular
        ? (extent - 2 * inset) / (2 + Math.SQRT2)
        : cornerDepths[size];
    const cut = Math.max(
        0,
        Math.min(depth, (right - left) / 2, (bottom - top) / 2),
    );
    const vertices: [number, number][] = [
        [left + cut, top],
        [right - cut, top],
        [right, top + cut],
        [right, bottom - cut],
        [right - cut, bottom],
        [left + cut, bottom],
        [left, bottom - cut],
        [left, top + cut],
    ];
    return {
        points: vertices
            .map(([horizontal, vertical]) => `${horizontal},${vertical}`)
            .join(" "),
        shadowPoints: [
            vertices[5],
            vertices[6],
            vertices[7],
            vertices[0],
            vertices[1],
        ]
            .map(([horizontal, vertical]) => `${horizontal},${vertical}`)
            .join(" "),
        highlightPoints: [
            vertices[1],
            vertices[2],
            vertices[3],
            vertices[4],
            vertices[5],
        ]
            .map(([horizontal, vertical]) => `${horizontal},${vertical}`)
            .join(" "),
        clipPath: `polygon(${vertices.map(([horizontal, vertical]) => `${horizontal}px ${vertical}px`).join(", ")})`,
    };
};
