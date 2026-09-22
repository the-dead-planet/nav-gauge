import { FC, ReactNode } from "react";
import { Label } from "@web-ui";
import styles from './settings-dialog.module.css';

interface Props {
    wide: boolean;
    id: string;
    children: ReactNode;
}

export const SettingsLabel: FC<Props> = ({ wide, id, children }) => wide
    ? <Label id={id} className={styles['wide-label']} shadow color="primary">{children}</Label>
    : <Label id={id} color="primary" align="left" className={styles['label']}>{children}</Label>;
