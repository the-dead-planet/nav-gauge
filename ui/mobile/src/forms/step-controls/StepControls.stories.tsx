import { FC, useState } from "react";
import { View } from "react-native";
import { StepControls } from "./StepControls";
import { NumberInput } from "../number-input";

export const Default: FC = () => {
    const [value, setValue] = useState(5);
    return (
        <View style={{ padding: 16 }}>
            <StepControls
                variant="fill-translucent"
                value={value}
                onChange={setValue}
                min={0}
                max={10}
            >
                <NumberInput value={value} onChange={setValue} showStepControls={false} />
            </StepControls>
        </View>
    );
};
