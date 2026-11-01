import { FC } from "react";
import { Modal, StyleSheet, View } from "react-native";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    TooltipProps,
    useTheme,
} from "@ui";
import { Text } from "../../design-system/typography";
import { resolveLayerStyle } from "../../design-system/theme";
import { Panel } from "../../hud/panel";
import { useTooltip } from "./useTooltip";

const styles = StyleSheet.create({
    overlay: { flex: 1 },
    tooltip: { position: "absolute" },
    connector: { position: "absolute" },
});

export const TooltipContent: FC<TooltipProps> = (props) => {
    const {
        content,
        color = DEFAULT_COLOR,
        variant = DEFAULT_FILL_VARIANT,
        size = DEFAULT_SIZE,
        maxWidth = 220,
    } = props;
    const theme = useTheme();
    const metrics = theme.sizes.control[size];
    const appearance = theme.resolveAppearance(variant, color);
    const connector = theme.resolveAppearance(
        variant,
        color,
        color,
        "hover-focus",
    );
    const {
        trigger,
        visible,
        dismiss,
        onTooltipLayout,
        position,
        connectionLine,
    } = useTooltip(props);
    return (
        <>
            {trigger}
            {visible &&
            content !== null &&
            content !== undefined &&
            content !== false &&
            content !== "" ? (
                <Modal
                    transparent
                    animationType="fade"
                    visible
                    onRequestClose={dismiss}
                    statusBarTranslucent
                >
                    <View
                        pointerEvents="none"
                        style={styles.overlay}
                        accessible={false}
                    >
                        <Panel
                            onLayout={onTooltipLayout}
                            elevationLayer="tooltip"
                            color={color}
                            variant={variant}
                            style={[
                                styles.tooltip,
                                {
                                    top: position.top,
                                    left: position.left,
                                    maxWidth,
                                    paddingHorizontal: metrics.paddingInline,
                                    paddingVertical: metrics.paddingBlock,
                                },
                            ]}
                        >
                            {typeof content === "string" ||
                            typeof content === "number" ? (
                                <Text
                                    style={{
                                        color: appearance.glyphs,
                                        fontSize: metrics.fontSize,
                                        lineHeight: metrics.fontSize * 1.1,
                                    }}
                                >
                                    {content}
                                </Text>
                            ) : (
                                content
                            )}
                        </Panel>
                        {connectionLine ? (
                            <View
                                style={[
                                    styles.connector,
                                    resolveLayerStyle(
                                        theme,
                                        "tooltip-connector",
                                        "down",
                                    ),
                                    {
                                        ...connectionLine,
                                        width: Math.max(
                                            0,
                                            connectionLine.width,
                                        ),
                                        height: Math.max(
                                            0,
                                            connectionLine.height,
                                        ),
                                        backgroundColor: connector.border.color,
                                    },
                                ]}
                            />
                        ) : null}
                    </View>
                </Modal>
            ) : null}
        </>
    );
};
