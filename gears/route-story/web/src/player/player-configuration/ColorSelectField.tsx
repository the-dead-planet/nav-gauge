import { FC, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { getMenuPosition, useTheme } from "@ui";
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
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    const position = useMemo(() => {
        if (!open || !anchor) {
            return {};
        }
        const rect = anchor.getBoundingClientRect();
        return getMenuPosition('top-left', { x: rect.left, y: rect.bottom }, window.innerWidth, window.innerHeight);
    }, [open, anchor]);

    return (
        <>
            <div className={styles['field']}>
                <button
                    type="button"
                    ref={setAnchor}
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
            {open && createPortal(
                <>
                    <div className={styles['backdrop']} onClick={() => setOpen(false)} />
                    <div
                        className={styles['popup']}
                        style={{
                            ...position,
                            backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                            borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                        }}
                        role="dialog"
                        aria-label={label}
                    >
                        <ColorPicker label={label} value={value} onChange={onChange} />
                    </div>
                </>,
                document.body,
            )}
        </>
    );
};