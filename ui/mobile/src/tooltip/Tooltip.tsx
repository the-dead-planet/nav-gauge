import { Children, cloneElement, FC, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Modal, Pressable, useWindowDimensions, GestureResponderEvent, LayoutChangeEvent } from "react-native";
import { ColorVariant, ErrorBoundary, TooltipPlacement, TooltipProps, useTheme } from "@ui";

const OFFSET = 8;

const getPosition = (
    rect: { x: number; y: number; width: number; height: number },
    tooltipSize: { width: number; height: number } | undefined,
    placement: TooltipPlacement
) => {
    const tw = tooltipSize?.width ?? 0;
    const th = tooltipSize?.height ?? 0;
    switch (placement) {
        case 'top':
            return { top: rect.y - OFFSET - th, left: rect.x + rect.width / 2 - tw / 2 };
        case 'bottom':
            return { top: rect.y + rect.height + OFFSET, left: rect.x + rect.width / 2 - tw / 2 };
        case 'left':
            return { top: rect.y + rect.height / 2 - th / 2, left: rect.x - OFFSET - tw };
        case 'right':
            return { top: rect.y + rect.height / 2 - th / 2, left: rect.x + rect.width + OFFSET };
        default:
            return { top: 0, left: 0 };
    }
};

const getAutoPlacement = (rect: { x: number; y: number; width: number; height: number }, windowWidth: number, windowHeight: number): TooltipPlacement => {
    const space = {
        top: rect.y,
        bottom: windowHeight - (rect.y + rect.height),
        left: rect.x,
        right: windowWidth - (rect.x + rect.width),
    };

    const max = Math.max(space.top, space.bottom, space.left, space.right);

    if (max === space.top) return 'top';
    if (max === space.bottom) return 'bottom';
    if (max === space.left) return 'left';
    return 'right';
};

const clampPosition = (
    pos: { top: number; left: number },
    tooltipSize: { width: number; height: number } | undefined,
    viewportWidth: number,
    viewportHeight: number,
): { top: number; left: number } => {
    if (!tooltipSize) return pos;
    const { width, height } = tooltipSize;
    return {
        left: Math.max(0, Math.min(pos.left, viewportWidth - width)),
        top: Math.max(0, Math.min(pos.top, viewportHeight - height)),
    };
};

const getConnectionLineGeom = (
    triggerRect: { x: number; y: number; width: number; height: number },
    tooltipPos: { top: number; left: number },
    tooltipSize: { width: number; height: number } | undefined,
    placement: TooltipPlacement
): { top: number; left: number; width: number; height: number } => {
    const tw = tooltipSize?.width ?? 0;
    const th = tooltipSize?.height ?? 0;
    switch (placement) {
        case 'top':
            return {
                left: tooltipPos.left + tw / 2 - 1,
                top: tooltipPos.top + th,
                width: 2,
                height: triggerRect.y - (tooltipPos.top + th),
            };
        case 'bottom':
            return {
                left: tooltipPos.left + tw / 2 - 1,
                top: triggerRect.y + triggerRect.height,
                width: 2,
                height: tooltipPos.top - (triggerRect.y + triggerRect.height),
            };
        case 'left': {
            const top = tooltipPos.top + th / 2 - 1;
            return {
                left: tooltipPos.left + tw,
                top,
                width: triggerRect.x - (tooltipPos.left + tw),
                height: 2,
            };
        }
        case 'right': {
            const top = tooltipPos.top + th / 2 - 1;
            return {
                left: triggerRect.x + triggerRect.width,
                top,
                width: tooltipPos.left - (triggerRect.x + triggerRect.width),
                height: 2,
            };
        }
        default:
            return { top: 0, left: 0, width: 0, height: 0 };
    }
};

interface ChildProps {
    ref?: unknown;
    onPressIn?: (e: GestureResponderEvent) => void;
    onPressOut?: (e: GestureResponderEvent) => void;
}

const hasCurrent = (ref: unknown): ref is { current: unknown } => (
    typeof ref === 'object' && ref !== null && 'current' in ref
);

const getVariantColors = (theme: ReturnType<typeof useTheme>, colorName: ColorVariant, variant: string) => {
    const base = theme.color(colorName, 500);
    const inverseBg = theme.color(colorName, theme.isLight ? 100 : 800);
    const accent = theme.color(colorName, theme.isLight ? 600 : 300);

    switch (variant) {
        case 'fill':
            return { backgroundColor: base, color: accent };
        case 'fill-inverse':
            return { backgroundColor: inverseBg, color: accent, borderColor: accent };
        case 'fill-translucent': {
            const opacity = theme.isLight ? 0.85 : 0.78;
            return { backgroundColor: theme.color(colorName, 500, opacity), color: accent };
        }
        default:
            return { backgroundColor: inverseBg, color: accent };
    }
};

export const Tooltip: FC<TooltipProps> = (props) => {
    return (
        <ErrorBoundary>
            <InternalTooltip {...props} />
        </ErrorBoundary>
    );
};

const InternalTooltip: FC<TooltipProps> = ({
    content,
    children,
    placement = 'auto',
    color = 'neutral',
    variant = 'fill-inverse',
    delay = 200,
    maxWidth = 220,
    showConnection = false,
}) => {
    const theme = useTheme();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: -9999, left: -9999 });
    const [connectionLine, setConnectionLine] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [triggerLayout, setTriggerLayout] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
    const [tooltipSize, setTooltipSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const recalculatePosition = useCallback(() => {
        const effective = placement === 'auto'
            ? getAutoPlacement(triggerLayout, windowWidth, windowHeight)
            : placement;
        const pos = getPosition(triggerLayout, tooltipSize, effective);
        const clamped = clampPosition(pos, tooltipSize, windowWidth, windowHeight);
        setPosition(clamped);

        if (showConnection) {
            setConnectionLine(getConnectionLineGeom(triggerLayout, clamped, tooltipSize, effective));
        } else {
            setConnectionLine(null);
        }
    }, [placement, windowWidth, windowHeight, triggerLayout, tooltipSize, showConnection]);

    const show = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setVisible(true);
        }, delay);
    }, [delay]);

    const cancelShow = useCallback(() => {
        clearTimeout(timeoutRef.current);
    }, []);

    const dismiss = useCallback(() => {
        clearTimeout(timeoutRef.current);
        setVisible(false);
    }, []);

    const measureTrigger = useCallback(() => {
        (triggerRef as unknown as { current?: { measureInWindow?: (cb: (x: number, y: number, w: number, h: number) => void) => void } }).current?.measureInWindow?.((x, y, width, height) => {
            setTriggerLayout({ x, y, width, height });
        });
    }, []);

    const triggerRef = useRef<View>(null);
    const triggerRefCallback = useCallback((node: View | null) => {
        (triggerRef as { current: View | null }).current = node;
    }, []);

    const recalculateRef = useRef(recalculatePosition);
    recalculateRef.current = recalculatePosition;

    useEffect(() => {
        if (!visible) return;
        measureTrigger();
        const timerId = setTimeout(() => recalculateRef.current(), 0);
        return () => clearTimeout(timerId);
    }, [visible, measureTrigger]);

    const child = Children.only(children) as ReactElement<ChildProps>;
    const childProps = child.props;

    const trigger = cloneElement(
        child,
        {
            ref: (node: View | null) => {
                triggerRefCallback(node);
                const originalRef = childProps.ref;
                if (typeof originalRef === 'function') {
                    originalRef(node);
                } else if (hasCurrent(originalRef)) {
                    originalRef.current = node;
                }
            },
            onPressIn: (e: GestureResponderEvent) => {
                show();
                childProps.onPressIn?.(e);
            },
            onPressOut: (e: GestureResponderEvent) => {
                cancelShow();
                childProps.onPressOut?.(e);
            },
        }
    );

    const variantColors = getVariantColors(theme, color, variant);
    const borderStyle = 'borderColor' in variantColors
        ? { borderWidth: 1, borderColor: (variantColors as { borderColor: string }).borderColor }
        : {};

    const onTooltipLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setTooltipSize({ width, height });
        recalculateRef.current();
    }, []);

    return (
        <>
            {trigger}
            {visible && content ? (
                <Modal transparent animationType="fade" visible={visible} onRequestClose={dismiss}>
                    <Pressable style={{ flex: 1 }} onPress={dismiss} />
                    <View
                        onLayout={onTooltipLayout}
                        pointerEvents="none"
                        style={{
                            position: 'absolute',
                            top: position.top,
                            left: position.left,
                            maxWidth,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 0,
                            backgroundColor: variantColors.backgroundColor,
                            ...borderStyle,
                        }}
                    >
                        <Text
                            style={{
                                color: variantColors.color,
                                fontSize: 12,
                                lineHeight: 16.8,
                            }}
                        >
                            {content}
                        </Text>
                    </View>
                    {showConnection && connectionLine ? (
                        <View
                            pointerEvents="none"
                            style={{
                                position: 'absolute',
                                top: connectionLine.top,
                                left: connectionLine.left,
                                width: connectionLine.width,
                                height: connectionLine.height,
                                backgroundColor: variantColors.color,
                            }}
                        />
                    ) : null}
                </Modal>
            ) : null}
        </>
    );
};
