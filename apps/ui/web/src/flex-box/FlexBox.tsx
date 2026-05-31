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
                justifyContent && styles[`justify-${justifyContent}`],
                alignItems && styles[`align-${alignItems}`],
            )}
            style={{
                gap,
                rowGap,
                columnGap: colGap,
            }}
        >
            {children}
        </div>
    );
};
