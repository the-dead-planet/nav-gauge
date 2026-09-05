import { FC, useRef, useState } from "react";
import { useTheme } from "@ui";
import { Popup } from "@web-ui";
import { ColorPicker } from "@web-ui";
import styles from './color-select-field.module.css';

interface Props {
    label?: string;
    value: string;
    onChange: (color: string) => void;
}

export const ColorSelectField: FC<Props> = ({ label, value, onChange }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <div className={styles['field']}>
                <button
                    type="button"
                    ref={anchorRef}
                    className={styles['swatch']}
                    style={{
                        backgroundColor: value,
                        borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    aria-label={label}
                    onClick={() => setOpen((current) => !current)}
                />
                {label ? <span className={styles['label']}>{label}</span> : null}
            </div>
            <Popup visible={open} onClose={() => setOpen(false)} anchor={anchorRef} placement="bottom-right" popupClassName={styles['color-popup']}>
                <div
                    style={{
                        backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                        borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                    }}
                    role="dialog"
                    aria-label={label}
                >
                    <ColorPicker label={label} value={value} onChange={(color) => { onChange(color); setOpen(false); }} />
                </div>
            </Popup>
        </>
    );
};
