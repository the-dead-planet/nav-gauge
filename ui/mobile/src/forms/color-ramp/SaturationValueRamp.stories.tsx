import { FC, useState } from "react";
import { SaturationValueRamp } from "./SaturationValueRamp";

export const Interactive: FC = () => {
    const [saturation, setSaturation] = useState(.7);
    const [brightness, setBrightness] = useState(.8);
    return (
        <SaturationValueRamp
            hue={210}
            saturation={saturation}
            brightness={brightness}
            onChange={(nextSaturation, nextBrightness) => {
                setSaturation(nextSaturation);
                setBrightness(nextBrightness);
            }}
        />
    );
};
