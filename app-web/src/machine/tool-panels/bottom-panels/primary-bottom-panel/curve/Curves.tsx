import { FC, ReactNode } from "react";
import { CurveLeft } from "./CurveLeft";
import { CurveRight } from "./CurveRight";
import { CurveMiddle } from "./CurveMiddle";
import styles from './curve.module.css';

interface Props {
    children?: ReactNode;
}

export const Curves: FC<Props> = () => {
    return (
        <div className={styles['curves']}>
            <CurveLeft />
            <CurveMiddle />
            <CurveRight />
        </div>
    );
};
