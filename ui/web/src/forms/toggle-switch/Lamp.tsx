import { FC } from "react";
import classNames from "classnames";
import styles from './toggle-switch.module.css';

interface LampProps {
    variant: 'off' | 'on';
    active: boolean;
}

export const Lamp: FC<LampProps> = ({ variant, active }) => {
    return (
        <span
            className={classNames(
                styles['lamp'],
                styles[`lamp-${variant}`],
                active ? styles[`lamp-${variant === 'off' ? 'error' : 'success'}`] : styles['lamp-inactive'],
            )}
        />
    );
};
