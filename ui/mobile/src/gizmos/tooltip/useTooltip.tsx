import {
    Children,
    cloneElement,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    View,
    useWindowDimensions,
    GestureResponderEvent,
    LayoutChangeEvent,
} from "react-native";
import { getAutoTooltipPlacement, TooltipPlacement, TooltipProps } from "@ui";

const OFFSET = 8;
const LONG_PRESS_DELAY = 500;
const LONG_PRESS_MOVE_TOLERANCE = 8;
const AUTO_DISMISS_DELAY = 1500;

const getPosition = (
    rect: { x: number; y: number; width: number; height: number },
    tooltipSize: { width: number; height: number } | undefined,
    placement: TooltipPlacement,
) => {
    const tw = tooltipSize?.width ?? 0;
    const th = tooltipSize?.height ?? 0;
    switch (placement) {
        case "top":
            return {
                top: rect.y - OFFSET - th,
                left: rect.x + rect.width / 2 - tw / 2,
            };
        case "bottom":
            return {
                top: rect.y + rect.height + OFFSET,
                left: rect.x + rect.width / 2 - tw / 2,
            };
        case "left":
            return {
                top: rect.y + rect.height / 2 - th / 2,
                left: rect.x - OFFSET - tw,
            };
        case "right":
            return {
                top: rect.y + rect.height / 2 - th / 2,
                left: rect.x + rect.width + OFFSET,
            };
        default:
            return { top: 0, left: 0 };
    }
};

const clampPosition = (
    pos: { top: number; left: number },
    tooltipSize: { width: number; height: number } | undefined,
    viewportWidth: number,
    viewportHeight: number,
): { top: number; left: number } => {
    if (!tooltipSize) {
        return pos;
    }
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
    placement: TooltipPlacement,
): { top: number; left: number; width: number; height: number } => {
    const tw = tooltipSize?.width ?? 0;
    const th = tooltipSize?.height ?? 0;
    switch (placement) {
        case "top":
            return {
                left: tooltipPos.left + tw / 2 - 1,
                top: tooltipPos.top + th,
                width: 2,
                height: triggerRect.y - (tooltipPos.top + th),
            };
        case "bottom":
            return {
                left: tooltipPos.left + tw / 2 - 1,
                top: triggerRect.y + triggerRect.height,
                width: 2,
                height: tooltipPos.top - (triggerRect.y + triggerRect.height),
            };
        case "left": {
            const top = tooltipPos.top + th / 2 - 1;
            return {
                left: tooltipPos.left + tw,
                top,
                width: triggerRect.x - (tooltipPos.left + tw),
                height: 2,
            };
        }
        case "right": {
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
    onPress?: (event: GestureResponderEvent) => void;
    onTouchStart?: (event: GestureResponderEvent) => void;
    onTouchMove?: (event: GestureResponderEvent) => void;
    onTouchEnd?: (event: GestureResponderEvent) => void;
    onTouchCancel?: (event: GestureResponderEvent) => void;
}

const hasCurrent = (ref: unknown): ref is { current: unknown } =>
    typeof ref === "object" && ref !== null && "current" in ref;

export const useTooltip = ({
    children,
    placement = "auto",
    showConnection = false,
}: TooltipProps) => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: -9999, left: -9999 });
    const [connectionLine, setConnectionLine] = useState<{
        top: number;
        left: number;
        width: number;
        height: number;
    } | null>(null);
    const [triggerLayout, setTriggerLayout] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    }>({ x: 0, y: 0, width: 0, height: 0 });
    const [tooltipSize, setTooltipSize] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });
    const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const touchOriginRef = useRef<{ x: number; y: number } | null>(null);
    const longPressRecognizedRef = useRef(false);

    const clearLongPress = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const dismiss = () => {
        if (dismissTimerRef.current) {
            clearTimeout(dismissTimerRef.current);
            dismissTimerRef.current = null;
        }
        setVisible(false);
    };

    const show = () => {
        longPressRecognizedRef.current = true;
        setVisible(true);
        if (dismissTimerRef.current) {
            clearTimeout(dismissTimerRef.current);
        }
        dismissTimerRef.current = setTimeout(dismiss, AUTO_DISMISS_DELAY);
    };

    const triggerRef = useRef<View>(null);
    const triggerRefCallback = (node: View | null) => {
        (triggerRef as { current: View | null }).current = node;
    };

    useEffect(() => {
        if (!visible) {
            return;
        }
        (
            triggerRef as unknown as {
                current?: {
                    measureInWindow?: (
                        callback: (
                            x: number,
                            y: number,
                            width: number,
                            height: number,
                        ) => void,
                    ) => void;
                };
            }
        ).current?.measureInWindow?.((x, y, width, height) => {
            setTriggerLayout({ x, y, width, height });
        });
    }, [visible, windowWidth, windowHeight]);

    useEffect(() => {
        if (
            !visible ||
            triggerLayout.width === 0 ||
            triggerLayout.height === 0 ||
            tooltipSize.width === 0 ||
            tooltipSize.height === 0
        ) {
            return;
        }
        const effectivePlacement =
            placement === "auto"
                ? getAutoTooltipPlacement(
                      triggerLayout,
                      tooltipSize,
                      windowWidth,
                      windowHeight,
                  )
                : placement;
        const nextPosition = clampPosition(
            getPosition(triggerLayout, tooltipSize, effectivePlacement),
            tooltipSize,
            windowWidth,
            windowHeight,
        );
        setPosition(nextPosition);
        setConnectionLine(
            showConnection
                ? getConnectionLineGeom(
                      triggerLayout,
                      nextPosition,
                      tooltipSize,
                      effectivePlacement,
                  )
                : null,
        );
    }, [
        visible,
        triggerLayout,
        tooltipSize,
        placement,
        showConnection,
        windowWidth,
        windowHeight,
    ]);

    useEffect(
        () => () => {
            clearLongPress();
            if (dismissTimerRef.current) {
                clearTimeout(dismissTimerRef.current);
            }
        },
        [],
    );

    const child = Children.only(children) as ReactElement<ChildProps>;
    const childProps = child.props;

    const trigger = cloneElement(child, {
        ref: (node: View | null) => {
            triggerRefCallback(node);
            const originalRef = childProps.ref;
            if (typeof originalRef === "function") {
                originalRef(node);
            } else if (hasCurrent(originalRef)) {
                originalRef.current = node;
            }
        },
        onTouchStart: (event: GestureResponderEvent) => {
            clearLongPress();
            longPressRecognizedRef.current = false;
            touchOriginRef.current = {
                x: event.nativeEvent.pageX,
                y: event.nativeEvent.pageY,
            };
            longPressTimerRef.current = setTimeout(show, LONG_PRESS_DELAY);
            childProps.onTouchStart?.(event);
        },
        onTouchMove: (event: GestureResponderEvent) => {
            const origin = touchOriginRef.current;
            if (
                origin &&
                Math.hypot(
                    event.nativeEvent.pageX - origin.x,
                    event.nativeEvent.pageY - origin.y,
                ) > LONG_PRESS_MOVE_TOLERANCE
            ) {
                clearLongPress();
                dismiss();
            }
            childProps.onTouchMove?.(event);
        },
        onTouchEnd: (event: GestureResponderEvent) => {
            clearLongPress();
            touchOriginRef.current = null;
            dismiss();
            childProps.onTouchEnd?.(event);
        },
        onTouchCancel: (event: GestureResponderEvent) => {
            clearLongPress();
            touchOriginRef.current = null;
            longPressRecognizedRef.current = false;
            dismiss();
            childProps.onTouchCancel?.(event);
        },
        onPress: (event: GestureResponderEvent) => {
            if (longPressRecognizedRef.current) {
                longPressRecognizedRef.current = false;
                return;
            }
            childProps.onPress?.(event);
        },
    });

    const onTooltipLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setTooltipSize({ width, height });
    };

    return {
        trigger,
        visible,
        dismiss,
        onTooltipLayout,
        position,
        connectionLine,
    };
};
