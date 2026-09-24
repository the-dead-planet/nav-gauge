import { Children, cloneElement, FC, FocusEvent, MouseEvent, PointerEvent, ReactElement, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { ErrorBoundary, getAutoTooltipPlacement, TooltipPlacement, TooltipProps, useTheme } from "@ui";
import style from './tooltip.module.css';

interface ChildProps {
    "aria-describedby"?: string;
    ref?: unknown;
    onClick?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    onPointerDown?: (event: PointerEvent) => void;
    onPointerMove?: (event: PointerEvent) => void;
    onPointerUp?: (event: PointerEvent) => void;
    onPointerCancel?: (event: PointerEvent) => void;
}

const hasCurrent = (ref: unknown): ref is { current: unknown } => (
    typeof ref === 'object' && ref !== null && 'current' in ref
);

const OFFSET = 8;
const LONG_PRESS_DELAY = 500;
const LONG_PRESS_MOVE_TOLERANCE = 8;

const getPosition = (rect: DOMRect, placement: TooltipPlacement) => {
    switch (placement) {
        case 'top':
            return { top: rect.top - OFFSET, left: rect.left + rect.width / 2 };
        case 'bottom':
            return { top: rect.bottom + OFFSET, left: rect.left + rect.width / 2 };
        case 'left':
            return { top: rect.top + rect.height / 2, left: rect.left - OFFSET };
        case 'right':
            return { top: rect.top + rect.height / 2, left: rect.right + OFFSET };
        default:
            return { top: 0, left: 0 };
    }
};

const clampPosition = (
    pos: { top: number; left: number },
    tooltipRect: DOMRect | undefined,
    viewportWidth: number,
    viewportHeight: number,
    placement: TooltipPlacement
): { top: number; left: number } => {
    if (!tooltipRect) return pos;

    let { top, left } = pos;
    const { width, height } = tooltipRect;

    switch (placement) {
        case 'top':
            left = Math.max(width / 2, Math.min(left, viewportWidth - width / 2));
            top = Math.max(height, top);
            break;
        case 'bottom':
            left = Math.max(width / 2, Math.min(left, viewportWidth - width / 2));
            top = Math.min(top, viewportHeight - height);
            break;
        case 'left':
            left = Math.max(width, left);
            top = Math.max(height / 2, Math.min(top, viewportHeight - height / 2));
            break;
        case 'right':
            left = Math.min(left, viewportWidth - width);
            top = Math.max(height / 2, Math.min(top, viewportHeight - height / 2));
            break;
    }

    return { top, left };
};

const getConnectionLineGeom = (
    triggerRect: DOMRect,
    tooltipPos: { top: number; left: number },
    placement: TooltipPlacement
): { top: number; left: number; width: number; height: number } => {
    switch (placement) {
        case 'top':
            return {
                left: tooltipPos.left - 1,
                top: tooltipPos.top,
                width: 2,
                height: triggerRect.top - tooltipPos.top,
            };
        case 'bottom':
            return {
                left: tooltipPos.left - 1,
                top: triggerRect.bottom,
                width: 2,
                height: tooltipPos.top - triggerRect.bottom,
            };
        case 'left':
            return {
                left: tooltipPos.left,
                top: tooltipPos.top - 1,
                width: triggerRect.left - tooltipPos.left,
                height: 2,
            };
        case 'right':
            return {
                left: triggerRect.right,
                top: tooltipPos.top - 1,
                width: tooltipPos.left - triggerRect.right,
                height: 2,
            };
        default:
            return { top: 0, left: 0, width: 0, height: 0 };
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
    maxWidth = 220,
    showConnection = false,
}) => {
    const theme = useTheme();
    const tooltipId = useId();
    const childRef = useRef<Element>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: -9999, left: -9999 });
    const [effectivePlacement, setEffectivePlacement] = useState<TooltipPlacement>(
        placement === 'auto' ? 'bottom' : placement
    );
    const [connectionLine, setConnectionLine] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const hoveredRef = useRef(false);
    const focusedRef = useRef(false);
    const suppressedRef = useRef(false);
    const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pointerOriginRef = useRef<{ x: number; y: number } | null>(null);

    const getViewportSize = () => ({
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
    });

    const recalculatePosition = () => {
        if (!childRef.current || !visible) {
            return;
        };

        const triggerRect = childRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current?.getBoundingClientRect();
        const viewport = getViewportSize();
        const effective = placement === 'auto'
            ? getAutoTooltipPlacement(
                { x: triggerRect.left, y: triggerRect.top, width: triggerRect.width, height: triggerRect.height },
                { width: tooltipRect?.width ?? 0, height: tooltipRect?.height ?? 0 },
                viewport.width,
                viewport.height,
            )
            : placement;
        setEffectivePlacement(effective);

        const pos = getPosition(triggerRect, effective);
        const clamped = clampPosition(pos, tooltipRect, viewport.width, viewport.height, effective);
        setPosition(clamped);

        if (showConnection && tooltipRect) {
            setConnectionLine(getConnectionLineGeom(triggerRect, clamped, effective));
        } else {
            setConnectionLine(null);
        }
    };

    useEffect(() => {
        if (visible) {
            recalculatePosition();
        }
    }, [visible, recalculatePosition]);

    const clearLongPress = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    useEffect(() => {
        if (!visible) {
            return;
        };

        const hideOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                suppressedRef.current = true;
                setVisible(false);
            }
        };
        const visualViewport = window.visualViewport;
        window.addEventListener('scroll', recalculatePosition, true);
        window.addEventListener('resize', recalculatePosition);
        window.addEventListener('keydown', hideOnEscape);
        visualViewport?.addEventListener('scroll', recalculatePosition);
        visualViewport?.addEventListener('resize', recalculatePosition);

        return () => {
            window.removeEventListener('scroll', recalculatePosition, true);
            window.removeEventListener('resize', recalculatePosition);
            window.removeEventListener('keydown', hideOnEscape);
            visualViewport?.removeEventListener('scroll', recalculatePosition);
            visualViewport?.removeEventListener('resize', recalculatePosition);
        };
    }, [visible, recalculatePosition]);

    useEffect(() => clearLongPress, []);

    const child = Children.only(children) as ReactElement<ChildProps>;
    const childProps = child.props;

    const trigger = cloneElement(
        child,
        {
            "aria-describedby": visible
                ? [childProps['aria-describedby'], tooltipId].filter(Boolean).join(' ')
                : childProps['aria-describedby'],
            ref: (node: Element | null) => {
                childRef.current = node;
                const originalRef = childProps.ref;
                if (typeof originalRef === 'function') {
                    originalRef(node);
                } else if (hasCurrent(originalRef)) {
                    originalRef.current = node;
                }
            },
            onClick: (event: MouseEvent) => {
                suppressedRef.current = true;
                setVisible(false);
                childProps.onClick?.(event);
            },
            onMouseEnter: (event: MouseEvent) => {
                hoveredRef.current = true;
                suppressedRef.current = false;
                if (window.matchMedia('(hover: hover)').matches) {
                    setVisible(true);
                }
                childProps.onMouseEnter?.(event);
            },
            onMouseLeave: (event: MouseEvent) => {
                hoveredRef.current = false;
                suppressedRef.current = false;
                if (!focusedRef.current) {
                    setVisible(false);
                }
                childProps.onMouseLeave?.(event);
            },
            onFocus: (event: FocusEvent) => {
                focusedRef.current = true;
                suppressedRef.current = false;
                setVisible(true);
                childProps.onFocus?.(event);
            },
            onBlur: (event: FocusEvent) => {
                focusedRef.current = false;
                suppressedRef.current = false;
                if (!hoveredRef.current) {
                    setVisible(false);
                }
                childProps.onBlur?.(event);
            },
            onPointerDown: (event: PointerEvent) => {
                if (event.pointerType !== 'mouse') {
                    clearLongPress();
                    pointerOriginRef.current = { x: event.clientX, y: event.clientY };
                    longPressTimerRef.current = setTimeout(() => {
                        suppressedRef.current = false;
                        setVisible(true);
                    }, LONG_PRESS_DELAY);
                }
                childProps.onPointerDown?.(event);
            },
            onPointerMove: (event: PointerEvent) => {
                const origin = pointerOriginRef.current;
                if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > LONG_PRESS_MOVE_TOLERANCE) {
                    clearLongPress();
                    setVisible(false);
                }
                childProps.onPointerMove?.(event);
            },
            onPointerUp: (event: PointerEvent) => {
                clearLongPress();
                pointerOriginRef.current = null;
                if (event.pointerType !== 'mouse') {
                    setVisible(false);
                }
                childProps.onPointerUp?.(event);
            },
            onPointerCancel: (event: PointerEvent) => {
                clearLongPress();
                pointerOriginRef.current = null;
                setVisible(false);
                childProps.onPointerCancel?.(event);
            },
        }
    );

    return (
        <>
            {trigger}
            {visible && content !== null && content !== undefined && content !== false && content !== '' ? createPortal(
                <>
                    <div
                        ref={tooltipRef}
                        id={tooltipId}
                        role="tooltip"
                        className={classNames(
                            style['tooltip-content'],
                            style[`placement-${effectivePlacement}`],
                            style[`color-${color}`],
                            style[`variant-${variant}`],
                            style[`mode-${theme.mode}`],
                            style['visible']
                        )}
                        style={{
                            top: position.top,
                            left: position.left,
                            width: `max-content`,
                            maxWidth: `${maxWidth}px`,
                        }}
                    >
                        {content}
                    </div>
                    {showConnection && connectionLine ? (
                        <div
                            className={classNames(style['connection-line'], style[`color-${color}`], style[`mode-${theme.mode}`])}
                            style={{
                                top: connectionLine.top,
                                left: connectionLine.left,
                                width: connectionLine.width,
                                height: connectionLine.height,
                            }}
                        />
                    ) : null}
                </>,
                document.body
            ) : null}
        </>
    );
};
