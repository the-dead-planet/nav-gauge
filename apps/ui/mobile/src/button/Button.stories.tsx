import { FC } from "react";
import { Button } from "./Button";

export const PrimaryButton: FC = () => {
    return (
        <Button title="Primary button" onPress={() => console.log("Pressed")} />
    );
};

export const SecondaryButton: FC = () => {
    return (
        <Button title="Secondary button" onPress={() => console.log("Pressed")} />
    );
};
