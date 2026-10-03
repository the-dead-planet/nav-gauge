import { FC, useState } from "react";
import { HueRamp } from "./HueRamp";

export const Interactive: FC = () => {
    const [value, setValue] = useState(210);
    return <HueRamp value={value} onChange={setValue} />;
};
