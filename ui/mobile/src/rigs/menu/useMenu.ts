import { useEffect, useRef, useState } from 'react';
import { HostInstance } from 'react-native';
import { MenuAnchor } from '@ui';
import { usePopupPosition } from '../popup/usePopupPosition';

export const useMenu = ({
    disabled,
    triggerAnchor,
    popupAnchor,
}: {
    disabled: boolean;
    triggerAnchor: MenuAnchor;
    popupAnchor: MenuAnchor;
}) => {
    const [open, setOpen] = useState(false);
    const visible = open && !disabled;
    const triggerRef = useRef<HostInstance>(null);
    const position = usePopupPosition({
        visible,
        anchor: triggerRef,
        triggerAnchor,
        popupAnchor,
    });
    useEffect(() => {
        if (disabled) {
            setOpen(false);
        }
    }, [disabled]);
    return {
        ...position,
        visible,
        triggerRef,
        toggle: () => setOpen((current) => !current),
        close: () => setOpen(false),
    };
};
