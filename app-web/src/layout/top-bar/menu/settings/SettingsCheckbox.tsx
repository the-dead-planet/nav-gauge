import { FC, ReactNode } from "react";
import { Checkbox } from "@web-ui";
import { SettingsLabel } from "./SettingsLabel";
import styles from './settings-dialog.module.css';

interface Props {
    wide: boolean;
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children: ReactNode;
}

export const SettingsCheckbox: FC<Props> = ({ wide, id, checked, onChange, children }) => (
    <div className={styles['field']}>
        {wide ? (
            <>
                <SettingsLabel wide id={id}>{children}</SettingsLabel>
                <Checkbox labelledBy={id} size="xs" color="primary" checked={checked} onChange={onChange} />
            </>
        ) : (
            <Checkbox className={styles['settings-checkbox']} size="xs" color="primary" checked={checked} onChange={onChange}>
                {children}
            </Checkbox>
        )}
    </div>
);
