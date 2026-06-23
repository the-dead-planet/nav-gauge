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
                    const textColor = shade >= 500 ? data[0][1] : data[9][1];

                    return (
                        <p
                            key={shade}
                            className={styles.box}
                            style={{
                                color: `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`,
                                backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})`
                            }}
                        >
                            {shade}
                        </p>
                    );
                })}
            </div>
        </>
    );
};
