import { ComponentProps, FC } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    DEFAULT_COLOR,
    actionButtonVariants,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    Icons,
    TabstripProps,
    useTheme,
} from '@ui';
import { Button } from '../../gizmos/button';
import { Menu, MenuItem } from '../menu';
import { HudContent } from '../../hud/HudContent';
import { useTabstripLayout } from './useTabstripLayout';

const styles = StyleSheet.create({
    root: { alignSelf: 'stretch', width: '100%' },
    header: { flexDirection: 'row' },
    content: { width: '100%' },
    measurement: { position: 'absolute', opacity: 0, flexDirection: 'row' },
    spreadItem: { flex: 1 },
    spreadButton: { width: '100%' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

export const Tabstrip: FC<TabstripProps> = ({
    options,
    value,
    onChange,
    size = DEFAULT_SIZE,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    variant = DEFAULT_FILL_VARIANT,
    highlighted = false,
    disabled = false,
    spread = false,
    overflowAccessibilityLabel,
    actions,
    children,
}) => {
    const theme = useTheme();
    const {
        setContainerWidth,
        optionWidths,
        overflowWidth,
        setOverflowWidth,
        visibleIndexes,
        setOptionWidth,
        selectTab,
    } = useTabstripLayout(options, value, onChange);
    const buttonProps = {
        color,
        glyphsShade,
        highlightColor,
        highlightGlyphsShade,
        size,
        variant: actionButtonVariants[variant].inactive,
    };
    const visibleIndexSet = new Set(visibleIndexes);
    const overflowOptions = options.filter(
        (_, index) => !visibleIndexSet.has(index),
    );
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        disabled ? 'disabled' : 'default',
    );
    const contentStyle = {
        backgroundColor: appearance.surface,
        borderColor: appearance.border.color,
        borderWidth: appearance.border.width,
        borderBottomWidth: actions ? 0 : appearance.border.width,
        padding:
            size === 'lg' ? 18 : size === 'md' ? 14 : size === 'sm' ? 10 : 6,
    };

    return (
        <View style={styles.root}>
            <View
                style={styles.header}
                accessibilityRole="tablist"
                onLayout={(event) =>
                    setContainerWidth(event.nativeEvent.layout.width)
                }
            >
                {visibleIndexes.map((optionIndex) => {
                    const option = options[optionIndex];
                    const selected = option.value === value;
                    const width = optionWidths[optionIndex] ?? 0;
                    const button = (
                        <Button
                            key={option.value}
                            {...buttonProps}
                            variant={
                                actionButtonVariants[variant][
                                    highlighted || selected
                                        ? 'active'
                                        : 'inactive'
                                ]
                            }
                            style={spread ? styles.spreadButton : undefined}
                            accessibilityRole="tab"
                            accessibilityState={{
                                selected,
                                disabled: disabled || option.disabled,
                            }}
                            highlighted={highlighted}
                            disabled={disabled || option.disabled}
                            onPress={() => selectTab(option.value)}
                        >
                            {option.label}
                        </Button>
                    );
                    return (
                        <View
                            key={option.value}
                            style={
                                spread
                                    ? [styles.spreadItem, { minWidth: width }]
                                    : undefined
                            }
                        >
                            {button}
                        </View>
                    );
                })}
                {overflowOptions.length ? (
                    <View
                        style={
                            spread
                                ? [
                                      styles.spreadItem,
                                      { minWidth: overflowWidth },
                                  ]
                                : undefined
                        }
                    >
                        <Menu
                            {...buttonProps}
                            variant={
                                actionButtonVariants[variant][
                                    highlighted ||
                                    overflowOptions.some(
                                        (option) => option.value === value,
                                    )
                                        ? 'active'
                                        : 'inactive'
                                ]
                            }
                            iconActiveColor={highlightColor}
                            iconSize={size}
                            triggerAccessibilityLabel={
                                overflowAccessibilityLabel
                            }
                            triggerActive={overflowOptions.some(
                                (option) => option.value === value,
                            )}
                            disabled={disabled}
                            triggerStyle={
                                spread ? styles.spreadButton : undefined
                            }
                        >
                            {overflowOptions.map((option) => (
                                <MenuItem
                                    key={option.value}
                                    onPress={() => selectTab(option.value)}
                                    selected={option.value === value}
                                    highlighted={highlighted}
                                    highlightColor={highlightColor}
                                    disabled={disabled || option.disabled}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </View>
                ) : null}
                <View
                    style={styles.measurement}
                    pointerEvents="none"
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                >
                    {options.map((option, index) => (
                        <Button
                            key={option.value}
                            {...buttonProps}
                            variant={
                                actionButtonVariants[variant][
                                    highlighted || option.value === value
                                        ? 'active'
                                        : 'inactive'
                                ]
                            }
                            onLayout={(event) => setOptionWidth(index, event)}
                        >
                            {option.label}
                        </Button>
                    ))}
                    <Button
                        {...buttonProps}
                        icon={
                            Icons.NounProject
                                .KebabMenu as unknown as ComponentProps<
                                typeof Button
                            >['icon']
                        }
                        accessibilityLabel={overflowAccessibilityLabel}
                        onLayout={(event) =>
                            setOverflowWidth(event.nativeEvent.layout.width)
                        }
                    />
                </View>
            </View>
            {children !== undefined && children !== null ? (
                <View key={value} style={[styles.content, contentStyle]}>
                    <HudContent appearance={appearance}>{children}</HudContent>
                </View>
            ) : null}
            {actions ? (
                <View
                    style={[
                        styles.footer,
                        {
                            marginTop: theme.sizes.control[size].gap,
                            gap: theme.sizes.control[size].gap,
                        },
                    ]}
                >
                    {actions.secondary ? (
                        <Button
                            {...buttonProps}
                            disabled={disabled}
                            onPress={actions.secondary.onPress}
                        >
                            {actions.secondary.label}
                        </Button>
                    ) : null}
                    <Button
                        {...buttonProps}
                        variant={actionButtonVariants[variant].active}
                        disabled={disabled}
                        onPress={actions.primary.onPress}
                    >
                        {actions.primary.label}
                    </Button>
                </View>
            ) : null}
        </View>
    );
};
