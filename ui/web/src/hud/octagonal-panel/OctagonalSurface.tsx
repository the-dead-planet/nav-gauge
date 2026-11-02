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
    const insetFilterId = useId();
    const borderWidth = appearance.border.width * Math.max(0, strokeWidth ?? 1);
    const { points: outline } = getOctagonalGeometry(
        width,
        height,
        size,
        0,
        regular,
    );
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
                    <polygon
                        points={points}
                        pathLength={300}
                        className={surface.glow}
                    />
                ) : null}
                <polygon
                    className={surface.paint}
                    points={points}
                    vectorEffect="non-scaling-stroke"
                    filter={
                        appearance.effects.depth === "inset"
                            ? `url(#${insetFilterId})`
                            : undefined
                    }
                />
                {appearance.effects.depth === "inset" ? (
                    <defs>
                        <filter
                            id={insetFilterId}
                            x="0"
                            y="0"
                            width={width}
                            height={height}
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                        >
                            <feGaussianBlur
                                in="SourceAlpha"
                                stdDeviation="2"
                                result="blur"
                            />
                            <feOffset
                                in="blur"
                                dx="3"
                                dy="3"
                                result="shadow-offset"
                            />
                            <feComposite
                                in="SourceAlpha"
                                in2="shadow-offset"
                                operator="out"
                                result="shadow-mask"
                            />
                            <feFlood
                                className={styles["inset-shadow"]}
                                result="shadow-color"
                            />
                            <feComposite
                                in="shadow-color"
                                in2="shadow-mask"
                                operator="in"
                                result="shadow"
                            />
                            <feOffset
                                in="blur"
                                dx="-2"
                                dy="-2"
                                result="highlight-offset"
                            />
                            <feComposite
                                in="SourceAlpha"
                                in2="highlight-offset"
                                operator="out"
                                result="highlight-mask"
                            />
                            <feFlood
                                className={styles["inset-highlight"]}
                                result="highlight-color"
                            />
                            <feComposite
                                in="highlight-color"
                                in2="highlight-mask"
                                operator="in"
                                result="highlight"
                            />
                            <feMerge>
                                <feMergeNode in="SourceGraphic" />
                                <feMergeNode in="shadow" />
                                <feMergeNode in="highlight" />
                            </feMerge>
                        </filter>
                    </defs>
                ) : null}
            </svg>
        </>
    );
};
