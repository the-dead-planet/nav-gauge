import { ComponentProps, FC } from "react";
import { GridProps } from "@ui";
import classNames from "classnames";
import styles from "./Grid.module.css";
import layout from "../layout.module.css";

export const Grid: FC<GridProps & ComponentProps<"div">> = ({
    cols,
    justifyContent,
    alignItems,
    gap,
    rowGap,
    colGap,
    className,
    children,
    ...props
}) => (
    <div
        {...props}
        className={classNames(
            styles.grid,
            cols && styles[`cols-${cols}`],
            justifyContent && layout[`justify-${justifyContent}`],
            alignItems && layout[`align-${alignItems}`],
            gap && layout[`gap-${gap}`],
            rowGap && layout[`row-gap-${rowGap}`],
            colGap && layout[`col-gap-${colGap}`],
            className,
        )}
    >
        {children}
    </div>
);
