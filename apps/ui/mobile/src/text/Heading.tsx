import { FC } from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    heading: {
        fontWeight: 700
    }
});

export const Heading: FC<TextProps> = ({ style, ...props }) => {
    const theme = useTheme();

    return (
        <Text {...props} style={[styles.heading, { color: theme.colors.text }, style]} />
    );
};