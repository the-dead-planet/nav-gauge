import { FC } from "react";
import { GridProps } from "@ui";
import classNames from "classnames";
import styles from "./Grid.module.css";

export const Grid: FC<GridProps> = ({
    cols,
    rows,
    templateAreas,
    justifyContent,
    alignContent,
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
                justifyContent && styles[`justify-${justifyContent}`],
                alignItems && styles[`align-${alignItems}`],
                alignContent && styles[`align-content-${alignContent}`],
            )}
            style={{
                gridTemplateColumns: cols,
                gridTemplateRows: rows,
                gridTemplateAreas: templateAreas,
                gap,
                rowGap,
                columnGap: colGap,
            }}
        >
            {children}
        </div>
    );
};
