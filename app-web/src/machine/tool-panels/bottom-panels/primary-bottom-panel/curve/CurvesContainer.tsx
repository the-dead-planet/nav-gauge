import { CSSProperties, FC, ReactNode } from "react";
import { CURVE_SIZE } from "@apparatus";
import { Curves } from "./Curves";
import styles from './curve.module.css';

interface Props {
    children?: ReactNode;
}

export const CurvesContainer: FC<Props> = ({ children }) => {
    return (
        <div
            className={styles['curves-container']}
            style={{
                '--curve-size': `${CURVE_SIZE}px`
            } as CSSProperties}
        >
            <Curves />

            {children}
        </div>
    );
};
