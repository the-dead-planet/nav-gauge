import { ComponentType, FC, useId, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { ClipPath, Defs, Path, Polyline, Svg, SvgProps } from "react-native-svg";
import {
    ChipProps,
    DEFAULT_SURFACE_VARIANT,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_FILL_VARIANT,
    getChipBevelPath,
    SizeVariant,
    useTheme,
} from "@ui";
import { Icon } from "../../design-system/icons";
import { Tooltip } from "../tooltip";
import { Text } from "../../design-system/typography";

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
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
    const [layout, setLayout] = useState({ width: 0, height: 0 });
    const insetClipId = useId();

    const onLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setLayout({ width, height });
    };

    const chip = (
        <View
            collapsable={false}
            onLayout={onLayout}
            style={[styles.chip, sizeStyles[size]]}
        >
            {layout.width > 0 && layout.height > 0 ? (
                <Svg style={StyleSheet.absoluteFill} width={layout.width} height={layout.height}>
                    <Path
                        d={getChipBevelPath(
                            size,
                            layout.width,
                            layout.height,
                            appearance.border.width / 2,
                        )}
                        fill={appearance.surface}
                        stroke={appearance.border.color}
                        strokeWidth={appearance.border.width}
                        vectorEffect="non-scaling-stroke"
                    />
                    {appearance.effects.depth === 'inset' ? (
                        <>
                            <Defs>
                                <ClipPath id={insetClipId}>
                                    <Path
                                        d={getChipBevelPath(
                                            size,
                                            layout.width,
                                            layout.height,
                                        )}
                                    />
                                </ClipPath>
                            </Defs>
                            <Polyline
                                points={`0,${layout.height} 0,0 ${layout.width},0`}
                                fill="none"
                                stroke={appearance.effects.inset.shadow}
                                strokeWidth={6}
                                clipPath={`url(#${insetClipId})`}
                            />
                            <Polyline
                                points={`0,${layout.height} ${layout.width},${layout.height} ${layout.width},0`}
                                fill="none"
                                stroke={appearance.effects.inset.highlight}
                                strokeWidth={4}
                                clipPath={`url(#${insetClipId})`}
                            />
                        </>
                    ) : null}
                </Svg>
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
