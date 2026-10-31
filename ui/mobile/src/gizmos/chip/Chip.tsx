import { ComponentType, FC } from "react";
import { StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";
import {
    ChipProps,
    DEFAULT_SURFACE_VARIANT,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_FILL_VARIANT,
    SizeVariant,
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

const iconSizes: Record<SizeVariant, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
};

const lineHeights: Record<SizeVariant, number> = {
    xs: 12,
    sm: 16,
    md: 18,
    lg: 20,
};

const sizeStyles = StyleSheet.create({
    lg: {
        fontSize: 16,
        paddingVertical: 6,
        paddingHorizontal: 10,
        gap: 10,
    },
    md: {
        fontSize: 14,
        paddingVertical: 4,
        paddingHorizontal: 8,
        gap: 8,
    },
    sm: {
        fontSize: 12,
        paddingVertical: 2,
        paddingHorizontal: 4,
        gap: 6,
    },
    xs: {
        fontSize: 10,
        paddingVertical: 1,
        paddingHorizontal: 3,
        gap: 4,
    },
});

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
    const appearance = theme.resolveAppearance(variant, color);
    const layout = usePanelDimensions();

    const chip = (
        <View
            collapsable={false}
            onLayout={layout.onLayout}
            style={[styles.chip, sizeStyles[size]]}
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
                    width={iconSizes[size]}
                    height={iconSizes[size]}
                    color={appearance.glyphs}
                />
            ) : null}
            {children !== undefined && children !== null ? (
                <Text
                    fontType={fontType}
                    fontWeight={appearance.fontWeight}
                    style={{
                        color: appearance.glyphs,
                        fontSize: sizeStyles[size].fontSize,
                        lineHeight: lineHeights[size],
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
