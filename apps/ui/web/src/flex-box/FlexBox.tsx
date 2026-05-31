import { FlexBoxProps } from "@ui";
import { FC } from "react";
import classNames from "classnames";
import styles from "./FlexBox.module.css";

export const FlexBox: FC<FlexBoxProps> = ({
    direction = "row",
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
                styles["flex-box"],
                styles[`direction-${direction}`],
                { [styles[`justify-${justifyContent}`]]: !!justifyContent },
                { [styles[`align-${alignItems}`]]: !!alignItems },
                { [styles[`gap-${gap}`]]: !!gap },
                { [styles[`row-gap-${rowGap}`]]: !!rowGap },
                { [styles[`col-gap-${colGap}`]]: !!colGap },
            )}
        >
            {children}
        </div>
    );
};