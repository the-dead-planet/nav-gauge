import { FC } from "react";
import { PANEL_HEADER_CURVE_SIZES } from "@apparatus";

export const CurveLeft: FC = () => {
    return (
        <svg width={PANEL_HEADER_CURVE_SIZES.size} height={PANEL_HEADER_CURVE_SIZES.size} viewBox="0 0 100 100">
            <path
                d="M0,98 C60,100 40,0 105,5 L105,100 L0,100 Z"
                fill="var(--toolbar-background-color)"
                stroke="none"
            />
            <path
                d="M0,96 C60,100 40,0 100,4"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
