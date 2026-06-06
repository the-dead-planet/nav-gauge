import { FlexBoxProps } from "@ui";
import { ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import styles from "./FlexBox.module.css";

interface Props {
    className?: string;
    style?: CSSProperties;
}

export const FlexBox: FC<FlexBoxProps & Props & ComponentProps<'div'>> = ({
    direction = "row",
    justifyContent,
    alignItems,
    gap,
    rowGap,
    colGap,
    className,
    style,
    children,
    ...props
}) => {
    return (
        <div
            className={classNames(
                styles["flex-box"],
                styles[`direction-${direction}`],
                {
                    [styles[`justify-${justifyContent}`]]: !!justifyContent,
                    [styles[`align-${alignItems}`]]: !!alignItems,
                    [styles[`gap-${gap}`]]: !!gap,
                    [styles[`row-gap-${rowGap}`]]: !!rowGap,
                    [styles[`col-gap-${colGap}`]]: !!colGap,
                },
                className,
            )}
            style={style}
            {...props}
        >
            {children}
        </div >
    );
};