import { ComponentType, FC } from "react";
import { StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";
import {
    ChipProps,
    DEFAULT_SURFACE_VARIANT,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_FILL_VARIANT,
    useTheme,
} from "@ui";
import { Icon } from "../../design-system/icons";
import { Tooltip } from "../tooltip";
import { Text } from "../../design-system/typography";
import { OctagonalSurface } from "../../hud/octagonal-panel/OctagonalSurface";
import { usePanelDimensions } from "../../hud/usePanelDimensions";

const styles = StyleSheet.create({
    chip: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
    },
});

interface Props {
    /**
     * Icon component, e.g. an icon from `@ui/icons`
     */
    icon?: ComponentType<SvgProps>;
}

export const Chip: FC<ChipProps & Props> = ({
    color = DEFAULT_COLOR,
    fontType,
    icon,
    size = DEFAULT_SIZE,
    variant = DEFAULT_SURFACE_VARIANT,
    tooltip,
    tooltipPlacement,
    tooltipVariant = DEFAULT_FILL_VARIANT,
    showTooltipConnection,
    children,
}) => {
    const theme = useTheme();
    const metrics = theme.sizes.chip[size];
    const appearance = theme.resolveAppearance(variant, color);
    const layout = usePanelDimensions();

    const chip = (
        <View
            collapsable={false}
            onLayout={layout.onLayout}
            style={[
                styles.chip,
                {
                    paddingVertical: metrics.paddingBlock,
                    paddingHorizontal: metrics.paddingInline,
                    gap: metrics.gap,
                },
            ]}
        >
            {layout.width > 0 && layout.height > 0 ? (
                <OctagonalSurface
                    width={layout.width}
                    height={layout.height}
                    size={size}
                    appearance={appearance}
                />
            ) : null}
            {icon ? (
                <Icon
                    icon={icon}
                    width={metrics.iconSize}
                    height={metrics.iconSize}
                    color={appearance.glyphs}
                />
            ) : null}
            {children !== undefined && children !== null ? (
                <Text
                    fontType={fontType}
                    fontWeight={appearance.fontWeight}
                    style={{
                        color: appearance.glyphs,
                        fontSize: metrics.fontSize,
                        lineHeight: metrics.lineHeight,
                    }}
                >
                    {children}
                </Text>
            ) : null}
        </View>
    );

    if (tooltip) {
        return (
            <Tooltip
                placement={tooltipPlacement}
                content={tooltip}
                variant={tooltipVariant}
                showConnection={showTooltipConnection}
            >
                {chip}
            </Tooltip>
        );
    }

    return chip;
};
