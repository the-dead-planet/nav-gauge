import { FC, useEffect, useRef, useState } from "react";
import {
    Animated,
    Pressable,
    View,
    ViewStyle,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { FieldsetProps, Icons, useTheme } from "@ui";
import { Icon } from "../../icons";
import { Text } from "../../typography";

const bevelBySize = { xs: 6, sm: 10, md: 20 } as const;

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

    const contentHeight = useRef(new Animated.Value(-1)).current;
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const measuredHeight = useRef(0);
    const [hasMeasured, setHasMeasured] = useState(false);
    const contentRef = useRef<View>(null);

    const chevronRotation = useRef(new Animated.Value(isExpanded ? 0 : -90)).current;

    useEffect(() => {
        Animated.timing(chevronRotation, {
            toValue: isExpanded ? 0 : -90,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isExpanded]);

    useEffect(() => {
        const listenerId = contentHeight.addListener(({ value }) => {
            if (value >= 0) {
                setContainerHeight(Math.round(value));
            }
        });
        return () => contentHeight.removeListener(listenerId);
    }, [contentHeight]);

    const measureContent = () => {
        contentRef.current?.measure((_x, _y, w, h) => {
            if (w > 0) {
                setContainerWidth(w);
            }
            if (h > 0) {
                measuredHeight.current = h;
                if (!hasMeasured) {
                    contentHeight.setValue(h);
                    setHasMeasured(true);
                }
            }
        });
    };

    useEffect(() => {
        const timer = setTimeout(measureContent, 50);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(measureContent, 50);
            return () => clearTimeout(timer);
        }
    }, [isExpanded]);

    const handleToggle = () => {
        if (measuredHeight.current === 0) {
            contentRef.current?.measure((_x, _y, w, h) => {
                if (w > 0) setContainerWidth(w);
                if (h > 0) {
                    measuredHeight.current = h;
                    animateToggle(h);
                }
            });
        } else {
            animateToggle(measuredHeight.current);
        }
    };

    const animateToggle = (targetHeight: number) => {
        if (isExpanded) {
            contentHeight.stopAnimation((currentValue) => {
                contentHeight.setValue(currentValue ?? targetHeight);
                Animated.timing(contentHeight, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: false,
                }).start(() => {
                    onExpandedChange?.(false);
                    setInternalExpanded(false);
                });
            });
        } else {
            onExpandedChange?.(true);
            setInternalExpanded(true);
            requestAnimationFrame(() => {
                contentRef.current?.measure((_x, _y, w, h) => {
                    if (w > 0) setContainerWidth(w);
                    if (h > 0) {
                        measuredHeight.current = h;
                        contentHeight.setValue(0);
                        Animated.timing(contentHeight, {
                            toValue: h,
                            duration: 250,
                            useNativeDriver: false,
                        }).start();
                    }
                });
            });
        }
    };

    const { fontSize, padding } = sizeMap[size];

    const borderColor = color
        ? theme.color(color)
        : theme.isLight
            ? theme.color('grey', 300)
            : theme.color('grey', 700);

    const bgColor = theme.componentColor('background');

    const labelColor = theme.isLight
        ? theme.color('grey', 800)
        : theme.color('grey', 200);

    const bevel = bevelBySize[size];

    const effectiveBevel = containerWidth > 0
        ? Math.min(bevel, containerWidth / 2 - 1)
        : bevel;

    const bevelPoints = containerWidth > 0 && containerHeight > 0
        ? `${effectiveBevel},0 ${containerWidth - effectiveBevel},0 ${containerWidth},${effectiveBevel} ${containerWidth},${containerHeight - effectiveBevel} ${containerWidth - effectiveBevel},${containerHeight} ${effectiveBevel},${containerHeight} 0,${containerHeight - effectiveBevel} 0,${effectiveBevel}`
        : '';

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
        <View style={{ position: 'relative', overflow: 'hidden', backgroundColor: bgColor }}>
            {containerWidth > 0 && containerHeight > 0 && (
                <Svg
                    viewBox={`0 0 ${containerWidth} ${containerHeight}`}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
                >
                    <Polygon
                        points={bevelPoints}
                        fill="none"
                        stroke={borderColor}
                        strokeWidth={1}
                    />
                </Svg>
            )}
            <Animated.View
                ref={contentRef}
                style={hasMeasured
                    ? { height: contentHeight, overflow: 'hidden' as const }
                    : undefined
                }
            >
                <View style={{ paddingLeft: effectiveBevel, paddingRight: effectiveBevel, padding }}>
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
            </Animated.View>
        </View>
    );
};
