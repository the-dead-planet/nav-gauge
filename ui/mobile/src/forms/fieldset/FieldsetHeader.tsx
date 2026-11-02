import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { DEFAULT_SIZE, FieldsetProps, Icons, useTheme } from "@ui";
import { Label } from "../../design-system/typography";
import { Button } from "../../gizmos/button";

const styles = StyleSheet.create({
    header: {
        zIndex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    disclosure: {
        paddingHorizontal: 0,
    },
    append: {
        marginLeft: "auto",
    },
});

interface Props extends FieldsetProps {
    onToggle: () => void;
}

export const FieldsetHeader: FC<Props> = ({
    label,
    prepend,
    append,
    expandable,
    expanded,
    onToggle,
    color,
    highlightColor,
    size = DEFAULT_SIZE,
    highlighted,
    disabled,
}) => {
    const controlSize = useTheme().sizes.control[size];

    return (
        <View
            pointerEvents={disabled ? "none" : "auto"}
            style={[
                styles.header,
                {
                    paddingHorizontal: controlSize.gap,
                    height: controlSize.height,
                    gap: controlSize.gap / 2,
                },
            ]}
        >
            {prepend}
            {expandable ? (
                <Button
                    variant="ghost"
                    color={color}
                    highlightColor={highlightColor}
                    highlighted={highlighted}
                    disabled={disabled}
                    size={size}
                    icon={Icons.NounProject.ChevronDownDoubleTriangle}
                    iconRotateZ={expanded ? 0 : -90}
                    accessibilityLabel={label}
                    accessibilityState={{ expanded }}
                    onPress={onToggle}
                    style={[styles.disclosure, { gap: controlSize.gap / 2 }]}
                >
                    {label.toUpperCase()}
                </Button>
            ) : (
                <Label
                    color={color}
                    highlightColor={highlightColor}
                    variant="ghost"
                    highlighted={highlighted}
                    disabled={disabled}
                    uppercase
                    style={{ fontSize: controlSize.fontSize }}
                >
                    {label}
                </Label>
            )}
            {append ? <View style={styles.append}>{append}</View> : null}
        </View>
    );
};
