import { CSSProperties, FC } from "react";
import { GridProps } from "@ui";
import classNames from "classnames";
import styles from "./Grid.module.css";

interface Props {
    className?: string;
    style?: CSSProperties;
}

export const Grid: FC<GridProps & Props> = ({
    cols,
    justifyContent,
    alignItems,
    gap,
    rowGap,
    colGap,
    className,
    style,
    children
}) => {
    return (
        <div
            className={classNames(
                styles.grid,
                {
                    [styles[`justify-${justifyContent}`]]: !!justifyContent,
                    [styles[`align-${alignItems}`]]: !!alignItems,
                    [styles[`gap-${gap}`]]: !!gap,
                    [styles[`row-gap-${rowGap}`]]: !!rowGap,
                    [styles[`col-gap-${colGap}`]]: !!colGap,
                    [styles[`cols-${cols}`]]: !!cols,
                },
                className
            )}
            style={style}
        >
            {children}
        </div>
    );
};