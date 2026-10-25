import { CSSProperties, FC } from "react";
import { allColorShades, ColorBoxProps, toCssColor } from "@ui";
import { Tooltip } from "../tooltip";
import { Label } from "../../design-system/typography";
import styles from "./color-box.module.css";

export const ColorBox: FC<ColorBoxProps> = ({
    name = "Color",
    color,
    shade = 500,
    size = 12,
    showPaletteOnHover = false,
}) => {
    const box = (
        <span
            className={styles["color-box"]}
            role="img"
            aria-label={`${name}, shade ${shade}`}
            tabIndex={showPaletteOnHover ? 0 : undefined}
            data-appearance-variant="default"
            data-appearance-color="neutral"
            style={
                {
                    backgroundColor: toCssColor({ ...color[shade], a: 1 }),
                    "--color-box-size": `${size}px`,
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
                <span className={styles["palette-tooltip"]}>
                    <Label className={styles["palette-label"]}>{name}</Label>
                    <span className={styles["palette"]}>
                        {allColorShades.map((paletteShade) => (
                            <span
                                key={paletteShade}
                                className={styles["palette-color"]}
                                style={{
                                    backgroundColor: toCssColor({
                                        ...color[paletteShade],
                                        a: 1,
                                    }),
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
