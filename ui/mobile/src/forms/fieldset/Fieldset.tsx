import { FC, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { FieldsetProps } from "@ui";
import { FieldsetHeaderContent } from "./FieldsetHeaderContent";
import { FieldsetBevelOutline } from "./FieldsetBevelOutline";
import { FieldsetHeader } from "./FieldsetHeader";

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        gap: 10,
    }
});

const bevelBySize = { xs: 6, sm: 10, md: 20 } as const;

const sizeMap = {
    xs: { fontSize: 11, padding: 6 },
    sm: { fontSize: 12, padding: 10 },
    md: { fontSize: 14, padding: 10 },
} as const;

interface Props extends FieldsetProps {
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
}

export const Fieldset: FC<Props> = ({
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
    const [internalExpanded, setInternalExpanded] = useState(true);
    const isExpanded = controlledExpanded ?? internalExpanded;

    const contentHeight = useRef(new Animated.Value(-1)).current;
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const measuredHeight = useRef(0);
    const [hasMeasured, setHasMeasured] = useState(false);
    const contentRef = useRef<View>(null);

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

    const { fontSize, padding } = sizeMap[size];
    const effectiveBevel = containerWidth > 0
        ? Math.min(bevelBySize[size], containerWidth / 2 - 1)
        : bevelBySize[size];

    return (
        <View style={styles.container}>
            <FieldsetBevelOutline
                containerWidth={containerWidth}
                containerHeight={containerHeight}
                bevel={effectiveBevel}
                color={color}
            />
            <Animated.View
                ref={contentRef}
                style={hasMeasured
                    ? { height: contentHeight, overflow: 'hidden' }
                    : undefined
                }
            >
                <View style={{ paddingLeft: effectiveBevel, paddingRight: effectiveBevel, padding }}>
                    <FieldsetHeader expandable={expandable} onToggle={handleToggle}>
                        <FieldsetHeaderContent
                            label={label}
                            expandable={expandable}
                            isExpanded={isExpanded}
                            prepend={prepend}
                            append={append}
                            fontSize={fontSize}
                        />
                    </FieldsetHeader>
                    {(!expandable || isExpanded) ? (
                        <View style={styles.content}>
                            {children}
                        </View>
                    ) : null}
                </View>
            </Animated.View>
        </View>
    );
};
