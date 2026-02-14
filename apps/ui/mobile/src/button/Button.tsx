import { FC } from "react";
import { ButtonProps as RNButtonProps, Button as RNButton } from "react-native";
import { useTheme } from "@ui";

export interface ButtonProps {
    variant?: 'default';
}

export const Button: FC<ButtonProps & RNButtonProps> = ({
    variant,
    ...props
}) => {
    const theme = useTheme();

    return (
        <RNButton {...props} color={props.color ?? theme.colors.button} />
    );
};
