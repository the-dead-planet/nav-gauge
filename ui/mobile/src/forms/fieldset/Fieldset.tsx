import { FC } from "react";
import { StyleSheet, View } from "react-native";
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

const styles = StyleSheet.create({
    collapsed: {
        display: "none",
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
                        padding: controlSize.paddingInline,
                        marginTop:
                            -(controlSize.height - controlSize.iconSize) / 2,
                    }}
                >
                    <View
                        pointerEvents={disabled ? "none" : "auto"}
                        accessibilityElementsHidden={!isExpanded}
                        importantForAccessibility={
                            isExpanded ? "auto" : "no-hide-descendants"
                        }
                        style={[
                            !isExpanded && styles.collapsed,
                            { gap: controlSize.gap },
                        ]}
                    >
                        {children}
                    </View>
                </OctagonalPanel>
            </View>
        </ThemeContext.Provider>
    );
};
