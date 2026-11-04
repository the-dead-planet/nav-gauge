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
import { useFieldsetHeight } from "./useFieldsetHeight";

const styles = StyleSheet.create({
    clip: {
        overflow: "hidden",
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

    const content = useFieldsetHeight(isExpanded);

    return (
        <ThemeContext.Provider value={theme}>
            <View>
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
                <OctagonalPanel
                    themeMode={themeMode}
                    color={color}
                    highlightColor={highlightColor}
                    variant={variant}
                    size={size}
                    highlighted={highlighted}
                    disabled={disabled}
                    style={{
                        marginTop:
                            -(controlSize.height - controlSize.iconSize) / 2,
                    }}
                >
                    <Animated.View
                        pointerEvents={
                            disabled || !isExpanded ? "none" : "auto"
                        }
                        accessibilityElementsHidden={!isExpanded}
                        importantForAccessibility={
                            isExpanded ? "auto" : "no-hide-descendants"
                        }
                        style={[styles.clip, { height: content.height }]}
                    >
                        <View
                            onLayout={content.onLayout}
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
                    </Animated.View>
                </OctagonalPanel>
            </View>
        </ThemeContext.Provider>
    );
};
