import { FC } from "react";
import { getResizeHandleGripPoints, ResizeHandleGripProps, useTheme } from "@ui";
import styles from './resize-handle.module.css';

export const ResizeHandleGrip: FC<ResizeHandleGripProps> = ({
    direction = 'horizontal',
    side,
    color = 'neutral',
    position,
}) => {
    const theme = useTheme();
    const gripSide = side ?? (direction === 'horizontal' ? 'right' : 'top');

    return (
        <svg
            key={position}
            className={styles['grip']}
            style={{
                '--grip-position': `${position}%`,
                '--grip-color': theme.color(color, theme.isLight ? 500 : 600, 0.5),
                '--grip-fill': theme.color(color, theme.isLight ? 200 : 900, 0.8),
                '--grip-highlight-fill': theme.color('secondary', theme.isLight ? 200 : 900, 0.8),
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
