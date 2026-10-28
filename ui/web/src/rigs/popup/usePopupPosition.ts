import { RefObject, useEffect, useRef, useState } from 'react';
import {
    getIconAnchorPoint,
    MenuAnchor,
    MenuPosition,
    menuPositionsMatch,
    placePopup,
} from '@ui';

export const usePopupPosition = ({
    visible,
    anchor,
    position,
    triggerAnchor,
    popupAnchor,
}: {
    visible: boolean;
    anchor?: RefObject<HTMLElement | null>;
    position?: { x: number; y: number };
    triggerAnchor: MenuAnchor;
    popupAnchor: MenuAnchor;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [popupPosition, setPopupPosition] = useState<MenuPosition>({});

    useEffect(() => {
        if (!visible) {
            return;
        }
        const computePosition = () => {
            const triggerBounds = anchor?.current?.getBoundingClientRect();
            const triggerPoint = triggerBounds
                ? getIconAnchorPoint(
                      triggerAnchor,
                      triggerBounds.left,
                      triggerBounds.top,
                      triggerBounds.width,
                      triggerBounds.height,
                  )
                : position;
            if (!triggerPoint) {
                return;
            }
            const bounds = containerRef.current?.getBoundingClientRect();
            const nextPosition = placePopup(
                popupAnchor,
                triggerPoint,
                bounds ? { width: bounds.width, height: bounds.height } : null,
                window.innerWidth,
                window.innerHeight,
            ).position;
            setPopupPosition((current) =>
                menuPositionsMatch(current, nextPosition)
                    ? current
                    : nextPosition,
            );
        };
        computePosition();
        let animationFrame = 0;
        const followTrigger = () => {
            computePosition();
            animationFrame = requestAnimationFrame(followTrigger);
        };
        animationFrame = requestAnimationFrame(followTrigger);
        return () => cancelAnimationFrame(animationFrame);
    }, [visible, anchor, position, triggerAnchor, popupAnchor]);

    return { containerRef, popupPosition };
};
