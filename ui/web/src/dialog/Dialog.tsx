import { ComponentProps, FC, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { DialogPlacement, DialogProps, FontType, TransitionProps } from "@ui";
import { Panel } from "../hud";
import { Button } from "../button";
import { H3 } from "../typography";
import { Transition } from "../transition";
import styles from './dialog.module.css';

export const Dialog: FC<DialogProps & ComponentProps<'div'>> = ({
    header,
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
    const slide: { [key in DialogPlacement]: TransitionProps['slide'] } = {
        ['middle']: 'to-bottom',
        ['left-drawer']: 'to-right',
        ['right-drawer']: 'to-left',
    }

    return createPortal(
        <div className={styles['overlay']}>
            <Transition render={render} slide={slide[placement]} fade onUnmount={onClose}>
                <div className={classNames(styles['container'], styles[placement], className)} {...props}>
                    <Panel
                        variant={variant}
                        color="primary"
                        className={classNames(styles['dialog'])}
                    >
                        <H3 fontType={FontType.NeonText} color="primary" className={styles['header']}>
                            {header.toUpperCase()}
                        </H3>
                        <div className={styles['content']}>
                            {children}
                        </div>
                        <div className={styles['footer']}>
                            <Button variant="fill-translucent" color="primary" onClick={() => setRender(false)}>
                                {closeText}
                            </Button>
                            {save ? (
                                <Button
                                    variant="fill"
                                    color="primary"
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
