import { CSSProperties, FC, KeyboardEvent, PointerEvent, useRef } from "react";
import { SaturationValueRampProps } from "@ui";
import styles from './color-ramp.module.css';

const clamp = (value: number): number => Math.max(0, Math.min(1, value));

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
    const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
        if (disabled || !rampRef.current) {
            return;
        }
        const bounds = rampRef.current.getBoundingClientRect();
        onChange(
            clamp((event.clientX - bounds.left) / bounds.width),
            clamp(1 - (event.clientY - bounds.top) / bounds.height),
        );
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const step = event.shiftKey ? .1 : .01;
        switch (event.key) {
            case 'ArrowLeft':
                onChange(clamp(saturation - step), brightness);
                break;
            case 'ArrowRight':
                onChange(clamp(saturation + step), brightness);
                break;
            case 'ArrowDown':
                onChange(saturation, clamp(brightness - step));
                break;
            case 'ArrowUp':
                onChange(saturation, clamp(brightness + step));
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
            style={{ '--ramp-hue': `hsl(${hue}, 100%, 50%)` } as CSSProperties}
            onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                updateFromPointer(event);
            }}
            onPointerMove={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    updateFromPointer(event);
                }
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
