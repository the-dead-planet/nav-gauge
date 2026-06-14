import { CSSProperties, FC, useEffect, useState } from "react";
import classNames from "classnames";
import { ErrorBoundary, TransitionProps } from "@ui";
import styles from './transition.module.css';

/**
 * Wraps the component in a `div` and adds mount and unmount animations
 */
export const Transition: FC<TransitionProps> = (props) => {
    return (
        <ErrorBoundary fallbackComponent={() => props.children}>
            <TransitionBase {...props} />
        </ErrorBoundary>
    );
};

const TransitionBase: FC<TransitionProps> = ({
    render,
    durationMs = 200,
    slide,
    fade,
    children
}) => {
    const [unmount, setUnmount] = useState(!render);

    useEffect(() => {
        if (render) {
            setUnmount(false);
            return;
        }
        const timeout = setTimeout(() => setUnmount(true), durationMs);

        return () => clearTimeout(timeout);
    }, [render]);

    if (unmount) {
        return null;
    }

    return (
        <div className={classNames({
            [styles['slide']]: !!slide,
            [styles[slide ?? '']]: !!slide,
            [styles['fade']]: !!fade,
            [styles['out']]: !render,
        })}
            style={{ '--duration': `${durationMs}ms` } as CSSProperties}>
            {children}
        </div>
    );
};
