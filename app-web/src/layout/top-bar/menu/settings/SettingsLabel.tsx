import { FC, ReactNode } from "react";
import { Text } from "@web-ui";
import styles from './settings-dialog.module.css';

interface Props {
    wide: boolean;
    id: string;
    children: ReactNode;
}

export const SettingsLabel: FC<Props> = ({ wide, id, children }) => wide
    ? <Text as="span" variant="caption" id={id} className={styles['wide-label']} shadow color="primary">{children}</Text>
    : <Text as="span" variant="caption" id={id} color="primary" align="left" className={styles['label']}>{children}</Text>;
