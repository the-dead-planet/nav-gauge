import { FC } from "react";
import {
    FillVariant,
    getResizeHandleGripPoints,
    ResizeHandleGripProps,
} from "@ui";
import styles from "./resize-handle.module.css";

export const ResizeHandleGrip: FC<
    ResizeHandleGripProps & { variant: FillVariant }
> = ({ direction = "horizontal", side, position, variant }) => {
    const gripSide = side ?? (direction === "horizontal" ? "right" : "top");
    const viewBox = direction === "horizontal" ? "0 0 8 24" : "0 0 24 8";
    const points = getResizeHandleGripPoints(direction, gripSide);
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="none"><polygon points="${points}" fill="white"/></svg>`)}")`;

    return (
        <span
            className={styles["grip"]}
            data-appearance-variant={variant}
            style={
                {
                    "--grip-position": `${position}%`,
                } as React.CSSProperties
            }
            aria-hidden="true"
        >
            <span
                className={styles["grip-backdrop"]}
                style={{
                    maskImage: backdropMask,
                    WebkitMaskImage: backdropMask,
                }}
            />
            <svg className={styles["grip-drawing"]} viewBox={viewBox}>
                <polygon points={points} />
            </svg>
        </span>
    );
};
