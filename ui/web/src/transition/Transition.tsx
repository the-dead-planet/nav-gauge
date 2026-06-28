import { cloneElement, CSSProperties, FC, isValidElement, useEffect, useState } from "react";
import classNames from "classnames";
import { ErrorBoundary, TransitionProps } from "@ui";
import styles from './transition.module.css';

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
    onUnmount,
    children
}) => {
    const [unmount, setUnmount] = useState(!render);

    useEffect(() => {
        if (render) {
            setUnmount(false);
            return;
        }
        const timeout = setTimeout(() => {
            setUnmount(true);
            onUnmount?.();
        }, durationMs);

        return () => clearTimeout(timeout);
    }, [render]);

    const effectiveChildren = Array.isArray(children) ? children : [children];

    if (unmount) {
        return null;
    }

    return effectiveChildren.map((child, i) => {
        if (isValidElement<{ className?: string; style?: CSSProperties }>(child)) {
            return cloneElement(child, {
                key: child.key || i,
                style: { ...(child.props.style ?? {}), '--duration': `${durationMs}ms` } as CSSProperties,
                className: classNames({
                    [child.props.className ?? '']: !!child.props.className,
                    [styles['slide']]: !!slide,
                    [styles[slide ?? '']]: !!slide,
                    [styles['fade']]: !!fade,
                    [styles['out']]: !render,
                }),
            });
        } else {
            return child;
        }
    });
};
