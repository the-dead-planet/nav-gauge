import { FC, SVGProps } from "react";
import { getClockDrawing } from "@ui";
import { ClockSvg } from "./ClockSvg";
import styles from "./clock-input.module.css";

interface Props {
    drawing: ReturnType<typeof getClockDrawing>;
    pointerEvents: SVGProps<SVGSVGElement>;
    thumbIcon?: string;
}

export const ClockDial: FC<Props> = ({ drawing, pointerEvents, thumbIcon }) => {
    const { viewBox, fullCircle, center, outerRadius, wedge } = drawing;
    const viewBoxValue = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxValue}" preserveAspectRatio="none">${fullCircle ? `<circle cx="${center}" cy="${center}" r="${outerRadius}" fill="white"/>` : `<path d="${wedge}" fill="white"/>`}</svg>`)}")`;

    return (
        <span className={styles.drawing}>
            <span
                className={styles.backdrop}
                style={{
                    maskImage: backdropMask,
                    WebkitMaskImage: backdropMask,
                }}
                aria-hidden="true"
            />
            <ClockSvg
                {...drawing}
                viewBox={viewBoxValue}
                pointerEvents={pointerEvents}
                thumbIcon={thumbIcon}
            >
                {fullCircle ? (
                    <circle
                        cx={center}
                        cy={center}
                        r={outerRadius}
                        className={styles.surface}
                    />
                ) : (
                    <path d={wedge} className={styles.surface} />
                )}
            </ClockSvg>
        </span>
    );
};
