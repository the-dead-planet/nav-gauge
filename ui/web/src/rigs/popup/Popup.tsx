import { ComponentProps, FC } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { DEFAULT_FILL_VARIANT, PopupProps } from '@ui';
import { Transition } from '../../motion/transition';
import { Panel } from '../../hud';
import { useOverlayDismiss } from '../useOverlayDismiss';
import { usePopupPosition } from './usePopupPosition';
import styles from './popup.module.css';

interface Props
    extends PopupProps, Omit<ComponentProps<'div'>, keyof PopupProps> {
    overlayClassName?: string;
    popupClassName?: string;
}

export const Popup: FC<Props> = ({
    anchor,
    position,
    triggerAnchor = 'top-left',
    popupAnchor = 'bottom-left',
    dismissOnClickAway = true,
    variant = DEFAULT_FILL_VARIANT,
    shape,
    visible,
    onClose,
    overlayClassName,
    popupClassName,
    className,
    style,
    children,
    ...props
}) => {
    const { containerRef, popupPosition } = usePopupPosition({
        visible,
        anchor,
        position,
        triggerAnchor,
        popupAnchor,
    });
    useOverlayDismiss({
        visible,
        anchor,
        containerRef,
        dismissOnClickAway,
        onClose,
    });

    if (!visible) {
        return null;
    }

    return createPortal(
        <div className={classNames(styles.overlay, overlayClassName)}>
            <Transition
                slide={popupAnchor.startsWith('top') ? 'to-bottom' : 'to-top'}
                render
            >
                <Panel
                    {...props}
                    forwardRef={containerRef}
                    variant={variant}
                    shape={shape}
                    className={classNames(styles.popup, popupClassName, className)}
                    style={{ ...style, ...popupPosition }}
                    elevationLayer="popup"
                >
                    {children}
                </Panel>
            </Transition>
        </div>,
        document.body,
    );
};
