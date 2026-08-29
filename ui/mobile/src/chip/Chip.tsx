import { ComponentType, FC, useState } from "react";
import { LayoutChangeEvent, Pressable, PressableProps, StyleSheet, Text as RNText, View, ViewStyle } from "react-native";
import { Path, Svg, SvgProps } from "react-native-svg";
import {
    ChipProps,
    ColorShade,
    DesignSystemColor,
    SizeVariant,
    ThemeComponentColor,
    useTheme,
} from "@ui";
import { Icon } from "../icons";
import { Tooltip } from "../tooltip";

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    label: {
        lineHeight: 18,
    },
});

interface Props {
    /**
     * Icon component, e.g. an icon from `@ui/icons`
     */
    icon?: ComponentType<SvgProps>;
    ariaLabel?: string;
}

type MobileChipProps = Props & Pick<PressableProps, 'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut'>;

const bevelSizes: Record<SizeVariant, number> = {
    xs: 2,
    sm: 4,
    md: 6,
};

const bevelPath = (bevel: number, width: number, height: number, inset: number): string => {
    const cut = Math.min(bevel, width / 2 - inset, height / 2 - inset);
    const x0 = inset;
    const y0 = inset;
    const x1 = width - inset;
    const y1 = height - inset;

    return `M ${x0 + cut} ${y0} H ${x1 - cut} L ${x1} ${y0 + cut} V ${y1 - cut} L ${x1 - cut} ${y1} H ${x0 + cut} L ${x0} ${y1 - cut} V ${y0 + cut} Z`;
};

const iconSizes: Record<SizeVariant, number> = {
    xs: 12,
    sm: 16,
    md: 20,
};

const sizeStyles = StyleSheet.create({
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

export const Chip: FC<ChipProps & MobileChipProps> = ({
    color = 'neutral',
    icon,
    size = 'sm',
    variant = 'fill',
    tooltip,
    tooltipPlacement,
    tooltipVariant = 'fill-inverse',
    showTooltipConnection,
    ariaLabel,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    children,
}) => {
    const theme = useTheme();
    const [layout, setLayout] = useState({ width: 0, height: 0 });

    const isSemantic = color === 'warning' || color === 'success' || color === 'error' || color === 'info';
    const resolved = isSemantic
        ? theme.componentColors[color as ThemeComponentColor]
        : { name: color as DesignSystemColor, shade: 500 as ColorShade };
    const shade = resolved.shade ?? 500;
    const chipColor = theme.color(resolved.name, shade);
    const translucent = (opacity: number) => theme.color(resolved.name, shade, opacity);
    const background = theme.componentColor('background');
    const textColor = theme.componentColor('text');
    const chipText = theme.isLight ? textColor : background;
    const iconColor = variant === 'fill' ? chipText : chipColor;

    const container: ViewStyle = {};
    let backgroundColor = chipColor;
    let labelColor = textColor;
    let borderWidth = 0;
    let borderColor = chipColor;

    switch (variant) {
        case 'fill':
            labelColor = chipText;
            break;
        case 'fill-inverse':
            backgroundColor = background;
            borderWidth = 1;
            borderColor = chipColor;
            labelColor = chipColor;
            break;
        case 'fill-translucent':
            backgroundColor = translucent(0.24);
            borderWidth = 1;
            borderColor = translucent(0.3);
            labelColor = chipColor;
            break;
        case 'ghost':
            backgroundColor = 'transparent';
            labelColor = chipColor;
            break;
        case 'outline':
            backgroundColor = 'transparent';
            borderWidth = 1;
            borderColor = chipColor;
            labelColor = chipColor;
            break;
        case 'inset':
            backgroundColor = translucent(0.04);
            labelColor = chipColor;
            break;
    }

    const onLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setLayout({ width, height });
    };

    const chip = (
        <Pressable
            accessibilityLabel={ariaLabel}
            accessibilityRole={onPress ? "button" : undefined}
            disabled={!onPress}
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <View
                collapsable={false}
                onLayout={onLayout}
                style={[styles.chip, container, sizeStyles[size]]}
            >
            {layout.width > 0 && layout.height > 0 ? (
                <Svg style={StyleSheet.absoluteFill} width={layout.width} height={layout.height}>
                    <Path
                        d={bevelPath(bevelSizes[size], layout.width, layout.height, borderWidth / 2)}
                        fill={backgroundColor}
                        stroke={borderWidth ? borderColor : undefined}
                        strokeWidth={borderWidth}
                        vectorEffect="non-scaling-stroke"
                    />
                </Svg>
            ) : null}
            {icon ? (
                <Icon
                    icon={icon}
                    width={iconSizes[size]}
                    height={iconSizes[size]}
                    color={iconColor}
                />
            ) : null}
            {children !== undefined && children !== null ? (
                <RNText style={[styles.label, { color: labelColor, fontSize: sizeStyles[size].fontSize }]}>
                    {children}
                </RNText>
            ) : null}
        </View>
        </Pressable>
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
