import { FC } from "react";
import styles from './curve.module.css';

export const CurveRight: FC = () => {
    return (
        <svg width="28" height="28" viewBox="0 0 100 100" className={styles['curve-right']}>
            <path
                d="M100,98 C40,100 60,0 0,5 L0,100 L100,100 Z"
                fill="var(--toolbar-background-color)"
                stroke="none"
            />
            <path
                d="M100,96 C40,100 60,0 0,4"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
