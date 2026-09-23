import { ComponentProps, FC, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { DialogPlacement, DialogProps, FontType, TransitionProps, useTheme } from "@ui";
import { useSubjectState } from "@tinker-chest";
import { Panel } from "../hud";
import { Button } from "../button";
import { H3 } from "../typography";
import { Transition } from "../transition";
import styles from './dialog.module.css';

export const Dialog: FC<DialogProps & ComponentProps<'div'>> = ({
    header,
    color = 'neutral',
    variant = 'fill-translucent',
    placement = 'middle',
    closeText,
    onClose,
    save,
    className,
    children,
    ...props
}) => {
    const [render, setRender] = useState(true);
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const slide: { [key in DialogPlacement]: TransitionProps['slide'] } = {
        ['middle']: 'to-bottom',
        ['left-drawer']: 'to-right',
        ['right-drawer']: 'to-left',
    }
    const isWide = !media.isLessThanSm;

    return createPortal(
        <div className={classNames(styles['overlay'], { [styles['overlay-out']]: !render })}>
            <Transition render={render} slide={slide[placement]} fade onUnmount={onClose}>
                <div className={classNames(styles['container'], isWide ? styles[placement] : styles['full-width'], className)} {...props}>
                    <Panel
                        variant={variant}
                        color={color}
                        className={classNames(styles['dialog'], styles[`color-${color}`])}
                    >
                        <H3 fontType={FontType.NeonText} color={color} className={styles['header']}>
                            {header.toUpperCase()}
                        </H3>
                        <div className={styles['content']}>
                            {children}
                        </div>
                        <div className={styles['footer']}>
                            <Button variant="fill-inverse" color={color} onClick={() => setRender(false)}>
                                {closeText}
                            </Button>
                            {save ? (
                                <Button
                                    variant="fill"
                                    color={color}
                                    onClick={() => {
                                        save.onSave();
                                        setRender(false);
                                    }}
                                >
                                    {save.saveText}
                                </Button>
                            ) : null}
                        </div>
                    </Panel>
                </div>
            </Transition>
        </div>,
        document.body,
    );
};
