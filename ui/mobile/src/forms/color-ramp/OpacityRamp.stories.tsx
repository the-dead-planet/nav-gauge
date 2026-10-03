import { FC, useState } from "react";
import { OpacityRamp } from "./OpacityRamp";

export const Interactive: FC = () => {
    const [value, setValue] = useState(.6);
    return <OpacityRamp color="rgb(67, 105, 255)" value={value} onChange={setValue} />;
};
