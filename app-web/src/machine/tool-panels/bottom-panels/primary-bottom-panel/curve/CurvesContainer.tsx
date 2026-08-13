import { CSSProperties, FC, ReactNode } from "react";
import { PANEL_HEADER_CURVE_SIZES } from "@apparatus";
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
                '--curve-size': `${PANEL_HEADER_CURVE_SIZES.size}px`
            } as CSSProperties}
        >
            <Curves />

            {children}
        </div>
    );
};
