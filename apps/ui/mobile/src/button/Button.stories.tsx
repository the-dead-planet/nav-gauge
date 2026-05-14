import { FC } from "react";
import { Button } from "./Button";

export const PrimaryButton: FC = () => {
    return (
        <Button title="Primary button" onPress={() => console.log("Pressed")} />
    );
};
