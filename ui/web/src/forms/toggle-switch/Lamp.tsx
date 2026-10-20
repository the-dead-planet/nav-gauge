import { FC } from "react";
import classNames from "classnames";
import styles from './toggle-switch.module.css';

interface LampProps {
    isSwitchedOn: boolean;
    active: boolean;
}

export const Lamp: FC<LampProps> = ({
    isSwitchedOn,
    active,
}) => {
    return (
        <span
            className={classNames(
                styles['lamp'],
                styles[`lamp-${isSwitchedOn ? 'on' : 'off'}`],
                active ? styles[`lamp-${!isSwitchedOn ? 'error' : 'success'}`] : styles['lamp-inactive'],
            )}
        />
    );
};
