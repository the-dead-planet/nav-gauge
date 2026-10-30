import { FC, useId } from "react";
import { DEFAULT_SIZE, getOctagonalGeometry, OctagonalSurfaceProps } from "@ui";
import styles from "./octagonal-panel.module.css";
import surface from "../surface.module.css";

export const OctagonalSurface: FC<OctagonalSurfaceProps> = ({
    width,
    height,
    size = DEFAULT_SIZE,
    appearance,
    regular = false,
    strokeWidth,
    showGlow = false,
}) => {
    const clipPathId = useId();
    const borderWidth = appearance.border.width * Math.max(0, strokeWidth ?? 1);
    const {
        points: outline,
        shadowPoints,
        highlightPoints,
    } = getOctagonalGeometry(width, height, size, 0, regular);
    const { points } = getOctagonalGeometry(
        width,
        height,
        size,
        borderWidth / 2,
        regular,
    );
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><polygon points="${outline}" fill="white"/></svg>`)}")`;

    return (
        <>
            {appearance.effects.backdropBlur > 0 ? (
                <span
                    className={styles.backdrop}
                    style={{
                        maskImage: backdropMask,
                        WebkitMaskImage: backdropMask,
                    }}
                    aria-hidden="true"
                />
            ) : null}
            <svg
                className={surface.drawing}
                viewBox={`0 0 ${width} ${height}`}
                aria-hidden="true"
                focusable="false"
            >
                {showGlow ? (
                    <polygon points={points} className={surface.glow} />
                ) : null}
                <polygon
                    className={surface.paint}
                    points={points}
                    vectorEffect="non-scaling-stroke"
                />
                {appearance.effects.depth === "inset" ? (
                    <>
                        <defs>
                            <clipPath id={clipPathId}>
                                <polygon points={outline} />
                            </clipPath>
                        </defs>
                        <polyline
                            className={styles["inset-shadow"]}
                            points={shadowPoints}
                            clipPath={`url(#${clipPathId})`}
                        />
                        <polyline
                            className={styles["inset-highlight"]}
                            points={highlightPoints}
                            clipPath={`url(#${clipPathId})`}
                        />
                    </>
                ) : null}
            </svg>
        </>
    );
};
