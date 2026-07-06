import { ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import { DividerProps } from "@ui";
import styles from "./divider.module.css";

export const Divider: FC<DividerProps & ComponentProps<'hr'>> = ({
    orientation = "horizontal",
    color,
    className,
    ...props
}) => {
    return (
        <hr
            className={classNames(
                styles["divider"],
                styles[orientation],
                color && styles[`color-${color}`],
                className,
            )}
            {...props}
        />
    );
};
