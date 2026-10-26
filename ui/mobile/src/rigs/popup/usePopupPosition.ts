import { RefObject, useEffect, useRef, useState } from 'react';
import {
    HostInstance,
    LayoutChangeEvent,
    useWindowDimensions,
} from 'react-native';
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
    anchor?: RefObject<HostInstance | null>;
    position?: { x: number; y: number };
    triggerAnchor: MenuAnchor;
    popupAnchor: MenuAnchor;
}) => {
    const [popupPosition, setPopupPosition] = useState<MenuPosition>({});
    const [popupSize, setPopupSize] = useState<{
        width: number;
        height: number;
    } | null>(null);
    const overlayRef = useRef<HostInstance>(null);
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    useEffect(() => {
        if (!visible) {
            return;
        }
        const updatePosition = (
            point: { x: number; y: number },
            width: number,
            height: number,
        ) => {
            const nextPosition = placePopup(
                popupAnchor,
                point,
                popupSize,
                width,
                height,
            ).position;
            setPopupPosition((current) =>
                menuPositionsMatch(current, nextPosition)
                    ? current
                    : nextPosition,
            );
        };
        const computePosition = () => {
            if (position) {
                updatePosition(position, windowWidth, windowHeight);
                return;
            }
            anchor?.current?.measureInWindow(
                (anchorX, anchorY, anchorWidth, anchorHeight) => {
                    overlayRef.current?.measureInWindow(
                        (overlayX, overlayY, overlayWidth, overlayHeight) => {
                            updatePosition(
                                getIconAnchorPoint(
                                    triggerAnchor,
                                    anchorX - overlayX,
                                    anchorY - overlayY,
                                    anchorWidth,
                                    anchorHeight,
                                ),
                                overlayWidth,
                                overlayHeight,
                            );
                        },
                    );
                },
            );
        };
        computePosition();
        const followInterval = setInterval(computePosition, 100);
        return () => clearInterval(followInterval);
    }, [
        visible,
        anchor,
        position,
        triggerAnchor,
        popupAnchor,
        popupSize,
        windowWidth,
        windowHeight,
    ]);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setPopupSize((current) =>
            current?.width === width && current.height === height
                ? current
                : { width, height },
        );
    };
    return { overlayRef, popupPosition, onLayout };
};
