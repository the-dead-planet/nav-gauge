import { FC } from "react";
import classNames from "classnames";
import styles from './toggle-switch.module.css';

interface LampProps {
    isSwitchedOn: boolean;
    highlighted: boolean;
}

export const Lamp: FC<LampProps> = ({
    isSwitchedOn,
    highlighted,
}) => {
    return (
        <span
            className={classNames(
                styles['lamp'],
                styles[`lamp-${isSwitchedOn ? 'on' : 'off'}`],
                highlighted ? styles[`lamp-${!isSwitchedOn ? 'glitch' : 'secured'}`] : styles['lamp-inactive'],
            )}
        />
    );
};
