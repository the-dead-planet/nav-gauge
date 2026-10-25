import { FlexBoxProps } from "@ui";
import { ComponentProps, FC } from "react";
import classNames from "classnames";
import styles from "./FlexBox.module.css";
import layout from "../layout.module.css";

export const FlexBox: FC<FlexBoxProps & ComponentProps<"div">> = ({
    direction = "row",
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
            styles["flex-box"],
            styles[`direction-${direction}`],
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
