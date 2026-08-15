import { FC } from "react";
import { Icon } from "../../icons";
import styles from './icon-rotate-input.module.css';

interface Props {
    icon?: string;
    iconSize: number;
    displayAngle: number;
    iconColor: string;
}

export const RotateIconWrapper: FC<Props> = ({
    icon,
    iconSize,
    displayAngle,
    iconColor,
}) => (
    <div
        className={styles['icon-wrapper']}
        style={{ transform: `rotate(${displayAngle}deg)` }}
    >
        {icon ? (
            <Icon
                src={icon}
                width={iconSize}
                height={iconSize}
                color={iconColor}
            />
        ) : null}
    </div>
);
