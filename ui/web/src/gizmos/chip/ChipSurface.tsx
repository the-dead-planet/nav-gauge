import { FC, useId } from "react";
import { getChipBevelPath, ResolvedThemeAppearance, SizeVariant } from "@ui";
import styles from "./chip.module.css";

interface Props {
    width: number;
    height: number;
    size: SizeVariant;
    appearance: ResolvedThemeAppearance;
}

export const ChipSurface: FC<Props> = ({ width, height, size, appearance }) => {
    const clipPathId = useId();
    const outline = getChipBevelPath(size, width, height);
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${outline}" fill="white"/></svg>`)}")`;

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
                className={styles.drawing}
                viewBox={`0 0 ${width} ${height}`}
                aria-hidden="true"
                focusable="false"
            >
                <path
                    className={styles.paint}
                    d={getChipBevelPath(
                        size,
                        width,
                        height,
                        appearance.border.width / 2,
                    )}
                    vectorEffect="non-scaling-stroke"
                />
                {appearance.effects.depth === "inset" ? (
                    <>
                        <defs>
                            <clipPath id={clipPathId}>
                                <path d={outline} />
                            </clipPath>
                        </defs>
                        <polyline
                            className={styles["inset-shadow"]}
                            points={`0,${height} 0,0 ${width},0`}
                            clipPath={`url(#${clipPathId})`}
                        />
                        <polyline
                            className={styles["inset-highlight"]}
                            points={`0,${height} ${width},${height} ${width},0`}
                            clipPath={`url(#${clipPathId})`}
                        />
                    </>
                ) : null}
            </svg>
        </>
    );
};
