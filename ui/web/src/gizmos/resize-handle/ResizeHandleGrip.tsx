import { FC } from "react";
import { getResizeHandleGripPoints, ResizeHandleGripProps } from "@ui";
import styles from './resize-handle.module.css';

export const ResizeHandleGrip: FC<ResizeHandleGripProps> = ({
    direction = 'horizontal',
    side,
    position,
}) => {
    const gripSide = side ?? (direction === 'horizontal' ? 'right' : 'top');

    return (
        <svg
            key={position}
            className={styles['grip']}
            style={{
                '--grip-position': `${position}%`,
            } as React.CSSProperties}
            viewBox={direction === 'horizontal' ? '0 0 8 24' : '0 0 24 8'}
            aria-hidden="true"
        >
            <polygon
                points={getResizeHandleGripPoints(direction, gripSide)}
            />
        </svg>
    );
};
