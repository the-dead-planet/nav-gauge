import { FC } from 'react';
import { ColorShade, RGBColor, ThemeColor } from "@ui";
import styles from './color.module.css';

export interface ColorProps {
    color: ThemeColor;
}

export const Color: FC<ColorProps> = ({ color }) => {
    const data = (Object.entries(color) as unknown as [ColorShade, RGBColor][]);
    const reversed = data.toReversed();

    return (
        <div className={styles.container}>
            {data.map(([shade, c], i) => {
                const textColor = reversed[i][1];
                return (
                    <p
                        key={shade}
                        className={styles.box}
                        style={{
                            color: `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`,
                            backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})`
                        }}
                    >{shade}</p>
                );
            })}
        </div>
    );
};
