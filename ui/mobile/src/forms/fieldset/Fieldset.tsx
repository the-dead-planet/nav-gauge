import { FC } from "react";
import { Animated, StyleSheet, View } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    FieldsetProps,
    ThemeContext,
    useFieldsetExpansion,
    useTheme,
} from "@ui";
import { OctagonalPanel } from "../../hud/octagonal-panel";
import { FieldsetHeader } from "./FieldsetHeader";
import { useFieldsetTransition } from "./useFieldsetTransition";

const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
    },
    clip: {
        overflow: "hidden",
    },
    panel: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    content: {
        flexShrink: 0,
    },
});

export const Fieldset: FC<FieldsetProps> = ({
    label,
    prepend,
    append,
    size = DEFAULT_SIZE,
    color = DEFAULT_COLOR,
    highlightColor,
    themeMode,
    variant = DEFAULT_SURFACE_VARIANT,
    highlighted = false,
    disabled = false,
    expandable = true,
    expanded,
    onExpandedChange,
    children,
}) => {
    const theme = useTheme().forMode(themeMode);
    const controlSize = theme.sizes.control[size];
    const { isExpanded, toggle } = useFieldsetExpansion({
        expandable,
        expanded,
        onExpandedChange,
        disabled,
    });

    const transition = useFieldsetTransition(isExpanded);

    return (
        <ThemeContext.Provider value={theme}>
            <View style={styles.container}>
                <FieldsetHeader
                    label={label}
                    prepend={prepend}
                    append={append}
                    expandable={expandable}
                    expanded={isExpanded}
                    onToggle={toggle}
                    color={color}
                    highlightColor={highlightColor}
                    size={size}
                    highlighted={highlighted}
                    disabled={disabled}
                />
                <Animated.View
                    collapsable={false}
                    pointerEvents={disabled || !isExpanded ? "none" : "auto"}
                    accessibilityElementsHidden={!isExpanded}
                    importantForAccessibility={
                        isExpanded ? "auto" : "no-hide-descendants"
                    }
                    style={[
                        styles.clip,
                        {
                            height: transition.height,
                            marginTop:
                                -(controlSize.height - controlSize.iconSize) /
                                2,
                        },
                    ]}
                >
                    <OctagonalPanel
                        themeMode={themeMode}
                        color={color}
                        highlightColor={highlightColor}
                        variant={variant}
                        size={size}
                        highlighted={highlighted}
                        disabled={disabled}
                        onLayout={transition.onLayout}
                        style={styles.panel}
                    >
                        <View
                            style={[
                                styles.content,
                                {
                                    padding: controlSize.paddingInline,
                                    gap: controlSize.gap,
                                },
                            ]}
                        >
                            {children}
                        </View>
                    </OctagonalPanel>
                </Animated.View>
            </View>
        </ThemeContext.Provider>
    );
};
