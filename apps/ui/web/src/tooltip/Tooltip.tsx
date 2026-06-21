import { Children, cloneElement, FC, ReactElement, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { ErrorBoundary, TooltipPlacement, TooltipProps, useTheme } from "@ui";
import style from './tooltip.module.css';

interface ChildProps {
    "aria-describedby"?: string;
    ref?: unknown;
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
}

const hasCurrent = (ref: unknown): ref is { current: unknown } => (
    typeof ref === 'object' && ref !== null && 'current' in ref
);

const OFFSET = 8;

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

const getAutoPlacement = (rect: DOMRect, windowWidth: number, windowHeight: number): TooltipPlacement => {
    const space = {
        top: rect.top,
        bottom: windowHeight - rect.bottom,
        left: rect.left,
        right: windowWidth - rect.right,
    };

    const max = Math.max(space.top, space.bottom, space.left, space.right);

    if (max === space.top) return 'top';
    if (max === space.bottom) return 'bottom';
    if (max === space.left) return 'left';
    return 'right';
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
    delay = 200,
    maxWidth = 220,
    showConnection = false,
}) => {
    const theme = useTheme();
    const tooltipId = useId();
    const childRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: -9999, left: -9999 });
    const [effectivePlacement, setEffectivePlacement] = useState<TooltipPlacement>(
        placement === 'auto' ? 'bottom' : placement
    );
    const [connectionLine, setConnectionLine] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    const recalculatePosition = useCallback(() => {
        if (!childRef.current || !visible) {
            return;
        };

        const triggerRect = childRef.current.getBoundingClientRect();
        const effective = placement === 'auto'
            ? getAutoPlacement(triggerRect, theme.media$.value.windowWidth, theme.media$.value.windowHeight)
            : placement;
        setEffectivePlacement(effective);

        const pos = getPosition(triggerRect, effective);
        const tooltipRect = tooltipRef.current?.getBoundingClientRect();
        const clamped = clampPosition(pos, tooltipRect, theme.media$.value.windowWidth, theme.media$.value.windowHeight, effective);
        setPosition(clamped);

        if (showConnection && tooltipRect) {
            setConnectionLine(getConnectionLineGeom(triggerRect, clamped, effective));
        } else {
            setConnectionLine(null);
        }
    }, [visible, placement, theme.media$, showConnection]);

    useEffect(() => {
        if (visible) {
            recalculatePosition();
        }
    }, [visible, recalculatePosition]);

    const show = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setVisible(true), delay);
    };

    const hide = () => {
        clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    useEffect(() => {
        if (!visible) {
            return;
        };

        window.addEventListener('scroll', recalculatePosition, true);
        window.addEventListener('resize', recalculatePosition);

        return () => {
            window.removeEventListener('scroll', recalculatePosition, true);
            window.removeEventListener('resize', recalculatePosition);
        };
    }, [visible, recalculatePosition]);

    const child = Children.only(children) as ReactElement<ChildProps>;
    const childProps = child.props;

    const trigger = cloneElement(
        child,
        {
            "aria-describedby": visible ? tooltipId : undefined,
            ref: (node: HTMLElement | null) => {
                childRef.current = node;
                const originalRef = childProps.ref;
                if (typeof originalRef === 'function') {
                    originalRef(node);
                } else if (hasCurrent(originalRef)) {
                    originalRef.current = node;
                }
            },
            onMouseEnter: (e: MouseEvent) => {
                show();
                childProps.onMouseEnter?.(e);
            },
            onMouseLeave: (e: MouseEvent) => {
                hide();
                childProps.onMouseLeave?.(e);
            },
            onFocus: (e: FocusEvent) => {
                show();
                childProps.onFocus?.(e);
            },
            onBlur: (e: FocusEvent) => {
                hide();
                childProps.onBlur?.(e);
            },
        }
    );

    return (
        <>
            {trigger}
            {visible && content ? createPortal(
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
