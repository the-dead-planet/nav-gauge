import { CSSProperties, FC, KeyboardEvent, PointerEvent, useRef } from "react";
import { colorRampThumbSizes, SaturationValueRampProps } from "@ui";
import { clampZeroOne } from "@tinker-chest";
import styles from './color-ramp.module.css';

export const SaturationValueRamp: FC<SaturationValueRampProps> = ({
    hue,
    saturation,
    brightness,
    label = 'Color',
    size = 'sm',
    disabled = false,
    onChange,
}) => {
    const rampRef = useRef<HTMLDivElement>(null);
    const boundsRef = useRef<DOMRect | null>(null);
    const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
        if (disabled || !boundsRef.current) {
            return;
        }
        const bounds = boundsRef.current;
        onChange(
            clampZeroOne((event.clientX - bounds.left) / bounds.width),
            clampZeroOne(1 - (event.clientY - bounds.top) / bounds.height),
        );
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const step = event.shiftKey ? .1 : .01;
        switch (event.key) {
            case 'ArrowLeft':
                onChange(clampZeroOne(saturation - step), brightness);
                break;
            case 'ArrowRight':
                onChange(clampZeroOne(saturation + step), brightness);
                break;
            case 'ArrowDown':
                onChange(saturation, clampZeroOne(brightness - step));
                break;
            case 'ArrowUp':
                onChange(saturation, clampZeroOne(brightness + step));
                break;
            default:
                return;
        }
        event.preventDefault();
    };

    return (
        <div
            ref={rampRef}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={`${label} saturation and brightness`}
            aria-valuetext={`${Math.round(saturation * 100)}% saturation, ${Math.round(brightness * 100)}% brightness`}
            aria-disabled={disabled}
            className={`${styles.ramp} ${styles[`size-${size}`]} ${disabled ? styles.disabled : ''}`}
            style={{
                '--ramp-hue': `hsl(${hue}, 100%, 50%)`,
                '--thumb-size': `${colorRampThumbSizes[size]}px`,
            } as CSSProperties}
            onPointerDown={(event) => {
                boundsRef.current = event.currentTarget.getBoundingClientRect();
                event.currentTarget.setPointerCapture(event.pointerId);
                updateFromPointer(event);
            }}
            onPointerMove={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    updateFromPointer(event);
                }
            }}
            onPointerUp={() => {
                boundsRef.current = null;
            }}
            onPointerCancel={() => {
                boundsRef.current = null;
            }}
            onKeyDown={handleKeyDown}
        >
            <span
                className={styles.thumb}
                style={{ left: `${saturation * 100}%`, top: `${(1 - brightness) * 100}%` }}
            />
        </div>
    );
};
