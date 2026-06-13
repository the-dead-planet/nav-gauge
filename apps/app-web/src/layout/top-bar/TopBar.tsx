import { FC } from "react";
import classNames from "classnames";
import { MachineWardTopBarProps, useMachineWard } from "@apparatus";
import { FontType, Icons, useTheme } from "@ui";
import { Button, H4, Menu, MenuItem } from "@web-ui";
import styles from './top-bar.module.css';

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    const theme = useTheme();
    const { individuator } = useMachineWard();

    // TODO: Icons: light/dark mode, sound, geolocation on/off, recording on/off?, menu
    return (
        <nav className={styles["top-bar"]}>
            <div className={classNames(styles["section"], styles["left"])}>
                <img src={Icons.Find} width={20} />
            </div>
            <H4 color="primary" fontType={FontType.NeonHeader}>
                {title}
            </H4>
            <div className={classNames(styles["section"], styles["right"])}>
                <Button
                    icon={Icons.NounProject.LightBulbCogWheel}
                    onClick={individuator.toggleMode}
                    variant="inset"
                    size="md"
                    color={theme.mode === 'dark' ? "secondary" : 'neutral'}
                    highlightColor={theme.mode === 'dark' ? "neutral" : 'secondary'}
                />
                <Menu placement="bottom-right">
                    <MenuItem label="Option 1" onPress={() => console.log("Option 1")} />
                    <MenuItem label="Option 2" onPress={() => console.log("Option 2")} />
                </Menu>
            </div>
        </nav>
    );
}
