import { Fragment, ReactNode, useRef } from "react";
import style from './tooltip.module.css';

export interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const tooltipRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <Fragment>
                {children}
            </Fragment>

            <div className={style['tooltip-content']}>
                {content}
            </div>
        </>
    );
};
