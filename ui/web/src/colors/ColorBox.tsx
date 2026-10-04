import { CSSProperties, FC } from 'react';
import { allColorShades, ColorBoxProps } from '@ui';
import { Tooltip } from '../tooltip';
import { Label } from '../typography';
import styles from './color-box.module.css';

const toCssColor = ({ r, g, b }: { r: number; g: number; b: number }) =>
    `rgb(${r}, ${g}, ${b})`;

export const ColorBox: FC<ColorBoxProps> = ({
    name = 'Color',
    color,
    shade = 500,
    size = 12,
    showPaletteOnHover = false,
}) => {
    const box = (
        <span
            className={styles['color-box']}
            style={
                {
                    backgroundColor: toCssColor(color[shade]),
                    '--color-box-size': `${size}px`,
                } as CSSProperties
            }
        />
    );

    if (!showPaletteOnHover) {
        return box;
    }

    return (
        <Tooltip
            content={
                <span className={styles['palette-tooltip']}>
                    <Label className={styles['palette-label']}>{name}</Label>
                    <span className={styles['palette']}>
                        {allColorShades.map((paletteShade) => (
                            <span
                                key={paletteShade}
                                className={styles['palette-color']}
                                style={{
                                    backgroundColor: toCssColor(
                                        color[paletteShade],
                                    ),
                                }}
                                title={String(paletteShade)}
                            />
                        ))}
                    </span>
                </span>
            }
        >
            {box}
        </Tooltip>
    );
};
