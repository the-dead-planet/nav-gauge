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
    placement = 'middle',
    onClose,
    onSave,
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
        <Transition render={render} slide={slide[placement]} fade onUnmount={onClose}>
            <div className={classNames(styles['container'], styles[placement], className)} {...props}>
                <Panel
                    variant='fill-translucent'
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
                        <Button variant="fill-translucent" color="primary" onClick={() => setRender(false)}>Close</Button>
                        {onSave? <Button variant="fill" color="primary" onClick={() => {
                            onSave();
                            setRender(false);
                        }}>Save</Button> : null}
                    </div>
                </Panel>
            </div>
        </Transition>,
        document.body,
    );
};
