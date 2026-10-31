import { FC } from "react";
import { Icon } from "../../design-system/icons";
import styles from "./clock-input.module.css";

interface Props {
    center: number;
    pointerX: number;
    pointerY: number;
    thumbRadius: number;
    strokeWidth: number;
    icon?: string;
}

export const ClockThumb: FC<Props> = ({
    center,
    pointerX,
    pointerY,
    thumbRadius,
    strokeWidth,
    icon,
}) => {
    return (
        <g>
            <circle
                cx={center + pointerX}
                cy={center + pointerY}
                r={thumbRadius}
                className={styles.thumb}
                strokeWidth={strokeWidth}
            />
            {icon ? (
                <foreignObject
                    x={center + pointerX - thumbRadius * 2}
                    y={center + pointerY - thumbRadius * 2}
                    width={thumbRadius * 4}
                    height={thumbRadius * 4}
                >
                    <Icon
                        src={icon}
                        width={thumbRadius * 4}
                        height={thumbRadius * 4}
                    />
                </foreignObject>
            ) : null}
        </g>
    );
};
