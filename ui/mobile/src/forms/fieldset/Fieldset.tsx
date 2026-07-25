import { FC, useEffect, useRef, useState } from "react";
import { Animated, LayoutAnimation, Platform, Pressable, UIManager, View, ViewStyle } from "react-native";
import { FieldsetProps, Icons, useTheme } from "@ui";
import { Icon } from "../../icons";
import { Text } from "../../typography";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const sizeMap = {
    xs: { fontSize: 11, padding: 6 },
    sm: { fontSize: 12, padding: 10 },
    md: { fontSize: 14, padding: 10 },
} as const;

export const Fieldset: FC<FieldsetProps & {
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
}> = ({
    label,
    prepend,
    append,
    size = 'md',
    color,
    expandable,
    expanded: controlledExpanded,
    onExpandedChange,
    children,
}) => {
    const theme = useTheme();
    const [internalExpanded, setInternalExpanded] = useState(true);
    const isExpanded = controlledExpanded ?? internalExpanded;
    const chevronRotation = useRef(new Animated.Value(isExpanded ? 0 : -90)).current;

    useEffect(() => {
        Animated.timing(chevronRotation, {
            toValue: isExpanded ? 0 : -90,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isExpanded]);

    const handleToggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (onExpandedChange) {
            onExpandedChange(!isExpanded);
        } else {
            setInternalExpanded(!internalExpanded);
        }
    };

    const { fontSize, padding } = sizeMap[size];

    const borderColor = color
        ? theme.color(color)
        : theme.isLight
            ? theme.color('grey', 300)
            : theme.color('grey', 700);

    const labelColor = theme.isLight
        ? theme.color('grey', 800)
        : theme.color('grey', 200);

    const isCollapsed = expandable && !isExpanded;

    const containerStyle: ViewStyle = {
        borderWidth: 1,
        borderColor,
        borderRadius: 4,
        padding,
        ...(isCollapsed && { paddingVertical: 4, paddingHorizontal: 10 }),
        gap: 10,
    };

    const headerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    };

    const labelStyle = {
        fontSize,
        textTransform: 'uppercase' as const,
        color: labelColor,
        flex: 1,
    };

    const headerContent = (
        <View style={headerStyle}>
            {expandable ? (
                <Animated.View style={{
                    transform: [{
                        rotate: chevronRotation.interpolate({
                            inputRange: [-90, 0],
                            outputRange: ['-90deg', '0deg'],
                        })
                    }]
                }}>
                    <Icon icon={Icons.NounProject.ChevronDownDoubleTriangle} width={12} height={12} color={labelColor} />
                </Animated.View>
            ) : null}
            {prepend ? <View>{prepend}</View> : null}
            <Text style={labelStyle}>{label}</Text>
            {append ? <View>{append}</View> : null}
        </View>
    );

    return (
        <View style={containerStyle}>
            {expandable ? (
                <Pressable onPress={handleToggle}>
                    {headerContent}
                </Pressable>
            ) : (
                headerContent
            )}
            {(!expandable || isExpanded) ? (
                <View style={{ gap: 10 }}>
                    {children}
                </View>
            ) : null}
        </View>
    );
};
