import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { DividerProps, SpacingVariant } from "@ui";
import styles from "./divider.module.css";

const sizes: SpacingVariant[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const Divider: FC<DividerProps & ComponentProps<'hr'>> = ({
    orientation = "horizontal",
    color,
    m, mv, mh, mt, mr, mb, ml,
    className,
    ...props
}) => {
    return (
        <hr
            className={classNames(
                styles["divider"],
                styles[orientation],
                color && styles[`color-${color}`],
                {
                    ...(Object.fromEntries(
                        sizes.flatMap((size): [string, boolean][] => [
                            [styles[`margin-left-${size}`],   m === size || mh === size || ml === size],
                            [styles[`margin-right-${size}`],  m === size || mh === size || mr === size],
                            [styles[`margin-top-${size}`],    m === size || mv === size || mt === size],
                            [styles[`margin-bottom-${size}`], m === size || mv === size || mb === size],
                        ])
                    )),
                },
                className,
            )}
            {...props}
        />
    );
};
