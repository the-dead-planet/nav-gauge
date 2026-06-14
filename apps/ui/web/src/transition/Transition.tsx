import { cloneElement, CSSProperties, FC, isValidElement, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import { ErrorBoundary } from "@ui";
import styles from './transition.module.css';

export interface TransitionProps {
    render: boolean;
    /**
     * Defaults to 200 [ms]
     */
    durationMs?: number;
    slide?: 'to-top' | 'to-right' | 'to-bottom' | 'to-left';
    fade?: boolean;
    children: ReactNode;
}

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

    const effectiveChildren = Array.isArray(children) ? children : [children];

    if (unmount) {
        return null;
    }

    return effectiveChildren.map((child) => {
        if (isValidElement<{ className?: string; style?: CSSProperties }>(child)) {
            return cloneElement(child, {
                key: child.key,
                style: { '--duration': `${durationMs}ms` } as CSSProperties,
                className: classNames(child.props.className, {
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
