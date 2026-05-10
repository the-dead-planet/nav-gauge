import { FC } from "react";
import { Text as RNText, TextProps } from "react-native";
import { useTheme } from "@ui";

export const Text: FC<TextProps> = ({ style, ...props }) => {
    const theme = useTheme();

    return (
        <RNText {...props} style={[{ color: theme.componentColor('text') }, style]} />
    );
};