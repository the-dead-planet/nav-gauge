import { FC, ReactNode } from 'react';
import { ColorShade, RGBColor, Theme, ThemeColor } from "@ui";
import { Label } from '../typography';
import styles from './color.module.css';

export interface ColorProps {
    name: string;
    color: ThemeColor;
    action?: ReactNode;
}

export const Color: FC<ColorProps> = ({ name, color, action }) => {
    const data = (Object.entries(color) as unknown as [ColorShade, RGBColor][]);

    return (
        <div className={styles.color}>
            <Label bold className={styles.name}>{name}</Label>
            <div className={styles.row}>
                <div className={`${styles.box} ${styles.labels}`}>
                    <span>100</span>
                    <span>900</span>
                    <span>contrast</span>
                    <span className={styles['rgb-text']}>rgb</span>
                </div>
                <div className={styles.palette}>
                    {data.map(([shade, c]) => {
                        const textColor1 = color[100];
                        const textColor2 = color[900];
                        const contrastShade = Theme.contrastShade(color, shade);
                        const contrastColor = color[contrastShade];

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
                                <span style={{ color: `rgb(${contrastColor.r}, ${contrastColor.g}, ${contrastColor.b})` }}>
                                    {shade}
                                </span>
                                <span style={{ color: `rgb(${contrastColor.r}, ${contrastColor.g}, ${contrastColor.b})` }} className={styles['rgb-text']}>
                                    {c.r}, {c.g}, {c.b}
                                </span>
                            </p>
                        );
                    })}
                </div>
                {action ? <div className={styles.action}>{action}</div> : null}
            </div>
        </div>
    );
};
