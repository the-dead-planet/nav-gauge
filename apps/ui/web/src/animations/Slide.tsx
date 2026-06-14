import { cloneElement, CSSProperties, FC, isValidElement, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import styles from './animations.module.css';

export interface SlideProps {
    shouldRender: boolean;
    /**
     * Defaults to 200 [ms]
     */
    durationMs?: number;
    direction: 'to-top' | 'to-right' | 'to-bottom' | 'to-left';
    children: ReactNode;
}

export const Slide: FC<SlideProps> = ({
    shouldRender,
    durationMs = 200,
    direction,
    children
}) => {
    const [unmount, setUnmount] = useState(!shouldRender);

    useEffect(() => {
        if (shouldRender) {
            setUnmount(false);
            return;
        }
        console.log("Set timeout")
        const timeout = setTimeout(() => {
            console.log("unmount");
            setUnmount(true);
        }, durationMs);

        return () => clearTimeout(timeout);
    }, [shouldRender]);

    const effectiveChildren = Array.isArray(children) ? children : [children];

    if (unmount) {
        return null;
    }

    return effectiveChildren.map((child) => {
        if (isValidElement<{ className?: string; style?: CSSProperties }>(child) && typeof child.type === 'string') {
            console.log(child)
            return cloneElement(child, {
                key: child.key,
                style: { '--slide-duration': `${durationMs}ms` } as CSSProperties,
                className: classNames(child.props.className, styles[direction], {
                    [styles[`${direction}-out`]]: !shouldRender
                }),
            });
        } else {
            return child;
        }
    });
};
