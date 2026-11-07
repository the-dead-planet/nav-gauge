import { FC } from "react";
import { HueRampProps } from "@ui";
import { ColorRampSlider } from "./ColorRampSlider";
import styles from "./color-ramp.module.css";

export const HueRamp: FC<HueRampProps> = ({ label = "Color", ...props }) => (
    <ColorRampSlider
        {...props}
        label={`${label} hue`}
        max={360}
        step={1}
        className={styles.hue}
    />
);
