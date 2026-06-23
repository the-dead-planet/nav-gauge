import { FC } from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    h6: {
        fontWeight: 700
    }
});

export const Heading: FC<TextProps> = ({ style, ...props }) => {
    const theme = useTheme();

    return (
        <Text {...props} style={[styles.h6, { color: theme.componentColor('text') }, style]} />
    );
};