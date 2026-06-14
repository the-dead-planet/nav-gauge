import { cloneElement, CSSProperties, FC, isValidElement, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import styles from './animations.module.css';

export interface SlideProps {
    render: boolean;
    /**
     * Defaults to 200 [ms]
     */
    durationMs?: number;
    slide?: 'to-top' | 'to-right' | 'to-bottom' | 'to-left';
    fade?: boolean;
    children: ReactNode;
}

export const Transition: FC<SlideProps> = ({
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
        if (isValidElement<{ className?: string; style?: CSSProperties }>(child) && typeof child.type === 'string') {
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
