import { FC } from "react";
import classNames from "classnames";
import styles from './clock-input.module.css';

interface Props {
    center: number;
    pointerX: number;
    pointerY: number;
    thumbRadius: number;
    isDragging: boolean;
    strokeWidth: number;
    icon?: string;
}

export const ClockThumb: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    thumbRadius,
    isDragging,
    strokeWidth,
    icon,
}) => {
    return (
        <circle
            cx={center + pointerX}
            cy={center + pointerY}
            r={thumbRadius}
            className={classNames(
                styles.thumb,
                { [styles['thumb-active']]: isDragging }
            )}
            strokeWidth={strokeWidth}
        />
    );
};
