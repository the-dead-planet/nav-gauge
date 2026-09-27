import { FC } from 'react';
import { ColorShade, RGBColor, ThemeColor } from "@ui";
import styles from './color.module.css';

export interface ColorProps {
    name: string;
    color: ThemeColor;
}

export const Color: FC<ColorProps> = ({ name, color }) => {
    const data = (Object.entries(color) as unknown as [ColorShade, RGBColor][]);

    return (
        <>
            <h3>{name}</h3>
            <div className={styles.palette}>
                {data.map(([shade, c]) => {
                    const textColor1 = data[0][1];
                    const textColor2 = data[9][1];
                    const textColor = shade >= 500 ? textColor1 : textColor2;

                    return (
                        <p
                            key={shade}
                            className={styles.box}
                            style={{ backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})` }}
                        >
                            <span style={{ color: `rgb(${textColor1.r}, ${textColor1.g}, ${textColor1.b})` }}>
                                {shade}
                            </span>
                            <span style={{ color: `rgb(${textColor2.r}, ${textColor2.g}, ${textColor2.b})` }}>
                                {shade}
                            </span>
                            <span style={{ color: `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})` }} className={styles['rgb-text']}>
                                {c.r}, {c.g}, {c.b}
                            </span>
                        </p>
                    );
                })}
            </div>
        </>
    );
};
