import { FC, useState } from "react";
import { Switch, View } from "react-native";
import { Label } from "./Label";

export const LabelVariants: FC = () => {
    const [disabled, setDisabled] = useState(false);

    return (
        <View style={{ rowGap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
                <Switch value={disabled} onValueChange={setDisabled} accessibilityLabel="Disabled" />
                <Label>Disabled</Label>
            </View>
            <Label color="primary" disabled={disabled}>Label</Label>
        </View>
    );
};
