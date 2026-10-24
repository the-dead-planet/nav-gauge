import { FC, ReactNode } from "react";
import { Text } from "@web-ui";
import styles from './settings-dialog.module.css';

interface Props {
    id: string;
    children: ReactNode;
}

export const SettingsLabel: FC<Props> = ({ id, children }) => {
    return (
        <Text as="span" usage="caption" id={id} color="primary" shade={100} shadow uppercase className={styles['label']}>
            {children}
        </Text>
    );
};
