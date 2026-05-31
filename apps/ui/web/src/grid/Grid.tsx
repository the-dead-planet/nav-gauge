import { FC } from "react";
import { GridProps } from "@ui";
import classNames from "classnames";
import styles from "./Grid.module.css";

export const Grid: FC<GridProps> = ({
    cols,
    justifyContent,
    alignItems,
    gap,
    rowGap,
    colGap,
    children
}) => {
    return (
        <div
            className={classNames(
                styles.grid,
                { [styles[`justify-${justifyContent}`]]: !!justifyContent },
                { [styles[`align-${alignItems}`]]: !!alignItems },
                { [styles[`gap-${gap}`]]: !!gap },
                { [styles[`row-gap-${rowGap}`]]: !!rowGap },
                { [styles[`col-gap-${colGap}`]]: !!colGap },
                { [styles[`cols-${cols}`]]: !!cols },
            )}
        >
            {children}
        </div>
    );
};