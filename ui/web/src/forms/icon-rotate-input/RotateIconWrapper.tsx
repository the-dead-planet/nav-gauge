import { FC } from "react";
import { Icon } from "../../design-system/icons";
import styles from "./icon-rotate-input.module.css";

interface Props {
    icon?: string;
    iconSize: number;
    displayAngle: number;
}

export const RotateIconWrapper: FC<Props> = ({
    icon,
    iconSize,
    displayAngle,
}) => (
    <div
        className={styles["icon-wrapper"]}
        style={{ transform: `rotate(${displayAngle}deg)` }}
    >
        {icon ? (
            <Icon
                src={icon}
                width={iconSize}
                height={iconSize}
                data-appearance-glyph
            />
        ) : null}
    </div>
);
