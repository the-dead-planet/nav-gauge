import { FC } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
    DividerProps,
    DEFAULT_COLOR,
    resolveTypographySpacing,
    SpacingVariant,
    Theme,
    useTheme,
} from "@ui";

const styles = StyleSheet.create({
    divider: {
        flexShrink: 0,
    },
    horizontal: {
        height: 1,
        width: "100%",
    },
    vertical: {
        width: 1,
        alignSelf: "stretch",
    },
});

const spacing = (value?: SpacingVariant): number | undefined =>
    value ? Number.parseInt(Theme.spacing[value], 10) : undefined;

export const Divider: FC<DividerProps & { style?: ViewStyle }> = ({
    orientation = "horizontal",
    color = DEFAULT_COLOR,
    m,
    mv,
    mh,
    mt,
    mr,
    mb,
    ml,
    style,
}) => {
    const theme = useTheme();
    const margins = resolveTypographySpacing({ m, mv, mh, mt, mr, mb, ml });

    return (
        <View
            role="separator"
            style={[
                styles.divider,
                styles[orientation],
                {
                    backgroundColor: theme.resolveAppearance(undefined, color)
                        .border.color,
                    marginTop: spacing(margins.marginTop),
                    marginRight: spacing(margins.marginRight),
                    marginBottom: spacing(margins.marginBottom),
                    marginLeft: spacing(margins.marginLeft),
                },
                style,
            ]}
        />
    );
};
