import { FC, ReactNode } from "react";
import { Text } from "@web-ui";
import { useTheme } from "@ui";
import styles from "./settings-dialog.module.css";

interface Props {
    id: string;
    children: ReactNode;
}

export const SettingsLabel: FC<Props> = ({ id, children }) => {
    const theme = useTheme();
    return (
        <Text
            as="span"
            usage="caption"
            id={id}
            color="primary"
            shadow={theme.isDark}
            uppercase
            className={styles["label"]}
        >
            {children}
        </Text>
    );
};
