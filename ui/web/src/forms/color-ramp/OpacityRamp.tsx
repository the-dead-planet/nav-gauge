import { CSSProperties, FC } from "react";
import { OpacityRampProps } from "@ui";
import { ColorRampSlider } from "./ColorRampSlider";
import styles from "./color-ramp.module.css";

export const OpacityRamp: FC<OpacityRampProps> = ({
    color,
    label = "Opacity",
    ...props
}) => (
    <ColorRampSlider
        {...props}
        label={label}
        max={1}
        step={0.01}
        valueText={`${Math.round(props.value * 100)}%`}
        className={styles.opacity}
        style={{ "--opacity-color": color } as CSSProperties}
    />
);
