import { FC, Ref } from "react";
import { StyleSheet, View, ViewProps, ViewInstance } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_SURFACE_VARIANT,
    DEFAULT_SIZE,
    OctagonalPanelProps,
    ThemeContext,
    useTheme,
} from "@ui";
import { HudContent } from "../HudContent";
import { usePanelDimensions } from "../usePanelDimensions";
import { OctagonalSurface } from "./OctagonalSurface";

const styles = StyleSheet.create({
    panel: {
        position: "relative",
    },
    content: {
        position: "relative",
    },
});

interface Props extends ViewProps {
    forwardRef?: Ref<ViewInstance>;
}

export const OctagonalPanel: FC<OctagonalPanelProps & Props> = ({
    themeMode,
    color = DEFAULT_COLOR,
    highlightColor = color,
    variant = DEFAULT_SURFACE_VARIANT,
    size = DEFAULT_SIZE,
    highlighted = false,
    disabled = false,
    forwardRef,
    accessibilityState,
    onLayout,
    style,
    children,
    ...props
}) => {
    const theme = useTheme().forMode(themeMode);
    const dimensions = usePanelDimensions();
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        disabled ? "disabled" : highlighted ? "active-pressed" : "default",
    );
    return (
        <ThemeContext.Provider value={theme}>
            <View
                {...props}
                ref={forwardRef}
                accessibilityState={{ ...accessibilityState, disabled }}
                style={[styles.panel, style]}
                onLayout={(event) => {
                    dimensions.onLayout(event);
                    onLayout?.(event);
                }}
            >
                {dimensions.width > 0 && dimensions.height > 0 ? (
                    <OctagonalSurface
                        width={dimensions.width}
                        height={dimensions.height}
                        size={size}
                        appearance={appearance}
                        elevation={theme.elevation(
                            variant === "ghost" || variant === "inset"
                                ? "none"
                                : "raised",
                            "down",
                        )}
                    />
                ) : null}
                <View style={styles.content}>
                    <HudContent appearance={appearance}>{children}</HudContent>
                </View>
            </View>
        </ThemeContext.Provider>
    );
};
