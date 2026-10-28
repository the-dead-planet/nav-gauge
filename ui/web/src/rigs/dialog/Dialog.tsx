import { ComponentProps, FC, useId } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
    DEFAULT_COLOR,
    actionButtonVariants,
    DEFAULT_FILL_VARIANT,
    DialogPlacement,
    DialogProps,
    FontType,
    TransitionProps,
    useTheme,
} from '@ui';
import { useSubjectState } from '@tinker-chest';
import { HudSurface } from '../../hud/HudSurface';
import surface from '../../hud/surface.module.css';
import { Button } from '../../gizmos/button';
import { H3 } from '../../design-system/typography';
import { Transition } from '../../motion/transition';
import styles from './dialog.module.css';
import { useDialog } from './useDialog';

export const Dialog: FC<DialogProps & ComponentProps<'div'>> = ({
    header,
    color = DEFAULT_COLOR,
    variant = DEFAULT_FILL_VARIANT,
    placement = 'middle',
    closeText,
    onClose,
    save,
    className,
    children,
    ...props
}) => {
    const { render, close, dialogRef, onKeyDown } = useDialog();
    const headerId = useId();
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const slide: { [key in DialogPlacement]: TransitionProps['slide'] } = {
        ['middle']: 'to-bottom',
        ['left-drawer']: 'to-right',
        ['right-drawer']: 'to-left',
    };
    const isWide = !media.isLessThanSm;

    return createPortal(
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headerId}
            className={classNames(styles['overlay'], {
                [styles['overlay-out']]: !render,
            })}
            onKeyDown={onKeyDown}
        >
            <Transition
                render={render}
                slide={slide[placement]}
                fade
                onUnmount={onClose}
            >
                <div
                    className={classNames(
                        styles['container'],
                        isWide ? styles[placement] : styles['full-width'],
                        className,
                    )}
                    {...props}
                >
                    <HudSurface
                        as="div"
                        rectangle
                        variant={variant}
                        color={color}
                        className={classNames(
                            surface['layer-dialog'],
                            styles['dialog'],
                        )}
                    >
                        <H3
                            id={headerId}
                            fontType={FontType.NeonText}
                            uppercase
                            fontWeight={500}
                            color={color}
                            shadow={variant === 'fill-translucent'}
                            className={styles['header']}
                        >
                            {header}
                        </H3>
                        <div className={styles['content']}>{children}</div>
                        <div className={styles['footer']}>
                            <Button
                                variant={actionButtonVariants[variant].inactive}
                                color={color}
                                onClick={close}
                            >
                                {closeText}
                            </Button>
                            {save ? (
                                <Button
                                    variant={
                                        actionButtonVariants[variant].active
                                    }
                                    color={color}
                                    onClick={() => {
                                        save.onSave();
                                        close();
                                    }}
                                >
                                    {save.saveText}
                                </Button>
                            ) : null}
                        </div>
                    </HudSurface>
                </div>
            </Transition>
        </div>,
        document.body,
    );
};
