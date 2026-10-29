import { FC, useId } from "react";
import classNames from "classnames";
import { hexagonGeometry, HexagonProps, ResolvedThemeAppearance } from "@ui";
import styles from "./hexagon.module.css";
import surface from "../surface.module.css";

interface Props extends Pick<
    HexagonProps,
    "shape" | "strokeWidth" | "children"
> {
    effects: Pick<ResolvedThemeAppearance["effects"], "backdropBlur" | "depth">;
    paintClassName?: string;
}

export const HexagonSurface: FC<Props> = ({
    shape = "pointy-top",
    strokeWidth,
    effects,
    paintClassName,
    children,
}) => {
    const { points, viewBox, maskPoints, shadowPoints, highlightPoints } =
        hexagonGeometry[shape];
    const insetRecessGradientId = useId();
    const insetClipPathId = useId();
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${maskPoints}" fill="white"/></svg>`)}")`;

    return (
        <>
            {effects.backdropBlur > 0 ? (
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
                viewBox={viewBox}
                className={surface.drawing}
                aria-hidden="true"
            >
                <defs>
                    <clipPath id={insetClipPathId}>
                        <polygon points={points} />
                    </clipPath>
                    <radialGradient id={insetRecessGradientId}>
                        <stop
                            offset="0"
                            className={styles["inset-recess-center"]}
                        />
                        <stop
                            offset=".65"
                            className={styles["inset-recess-center"]}
                        />
                        <stop
                            offset="1"
                            className={styles["inset-recess-edge"]}
                        />
                    </radialGradient>
                </defs>
                <polygon
                    points={points}
                    strokeWidth={strokeWidth ?? 1}
                    className={classNames(styles["polygon-glow"], surface.glow)}
                />
                <polygon
                    points={points}
                    className={classNames(
                        styles["polygon-base"],
                        surface.paint,
                        paintClassName,
                    )}
                />
                {effects.depth === "inset" ? (
                    <>
                        <polygon
                            points={points}
                            fill={`url(#${insetRecessGradientId})`}
                        />
                        <polyline
                            points={shadowPoints}
                            fill="none"
                            strokeWidth={10}
                            clipPath={`url(#${insetClipPathId})`}
                            className={classNames(
                                styles["inset-shadow"],
                                styles.fade,
                            )}
                        />
                        <polyline
                            points={highlightPoints}
                            fill="none"
                            strokeWidth={10}
                            clipPath={`url(#${insetClipPathId})`}
                            className={classNames(
                                styles["inset-highlight"],
                                styles.fade,
                            )}
                        />
                        <polyline
                            points={shadowPoints}
                            fill="none"
                            strokeWidth={3}
                            clipPath={`url(#${insetClipPathId})`}
                            className={styles["inset-shadow"]}
                        />
                        <polyline
                            points={highlightPoints}
                            fill="none"
                            strokeWidth={3}
                            clipPath={`url(#${insetClipPathId})`}
                            className={styles["inset-highlight"]}
                        />
                    </>
                ) : null}
            </svg>
            {children !== undefined ? (
                <span className={styles.content}>{children}</span>
            ) : null}
        </>
    );
};
