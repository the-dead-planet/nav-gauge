import { FC } from "react";
import styles from './curve.module.css';

export const CurveLeft: FC = () => {
    return (
        <svg width="28" height="28" viewBox="0 0 100 100" className={styles['curve-left']}>
            <path
                d="M0,98 C60,100 40,0 105,5 L105,100 L0,100 Z"
                fill="var(--toolbar-background-color)"
                stroke="none"
            />
            <path
                d="M0,96 C60,100 40,0 100,4"
                fill="none"
                stroke="var(--color-primary)"
                stroke-width="7"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
};
