import { FC, useEffect } from "react";
import { Text as RNText, TextProps } from "react-native";
import { useTheme } from "@ui";

export const Text: FC<TextProps> = ({ style, ...props }) => {
    const theme = useTheme();
    
    useEffect(() => {
        console.log({theme})
    }, [theme]);

    return (
        <RNText {...props} style={{
            color: theme.colors.text,
            ...style,
        }} />
    );
};