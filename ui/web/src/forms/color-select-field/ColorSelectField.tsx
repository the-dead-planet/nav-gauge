import { FC, useRef, useState } from "react";
import { ColorSelectFieldProps } from "@ui";
import { Popup } from "../../popup";
import { ColorButton } from "../color-button";
import { ColorPicker } from "../color-picker";
import styles from './color-select-field.module.css';

export const ColorSelectField: FC<ColorSelectFieldProps> = ({
    disabled = false,
    label = 'Color',
    value,
    opacityLabel,
    size = 'sm',
    variant = 'fill-inverse',
    onChange,
}) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <ColorButton
                ref={anchorRef}
                value={value}
                label={label}
                size={size}
                selected={open}
                disabled={disabled}
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            />
            <Popup
                visible={open}
                anchor={anchorRef}
                variant="fill-inverse"
                triggerAnchor="bottom-left"
                popupAnchor="top-left"
                onClose={() => setOpen(false)}
                popupClassName={styles.popup}
            >
                <div role="dialog" aria-label={label}>
                    <ColorPicker
                        label={label}
                        value={value}
                        opacityLabel={opacityLabel}
                        size={size}
                        variant={variant}
                        disabled={disabled}
                        onChange={onChange}
                    />
                </div>
            </Popup>
        </>
    );
};
