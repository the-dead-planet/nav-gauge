import { FC } from "react";
import { PANEL_HEADER_CURVE_SIZES } from "@apparatus";

export const CurveRight: FC = () => {
    return (
        <svg width={PANEL_HEADER_CURVE_SIZES.size} height={PANEL_HEADER_CURVE_SIZES.size} viewBox="0 0 100 100">
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
