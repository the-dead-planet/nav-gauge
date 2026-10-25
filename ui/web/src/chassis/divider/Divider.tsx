import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { DEFAULT_COLOR, DividerProps, resolveTypographySpacing } from "@ui";
import styles from "./divider.module.css";

export const Divider: FC<DividerProps & ComponentProps<"hr">> = ({
    orientation = "horizontal",
    color = DEFAULT_COLOR,
    m,
    mv,
    mh,
    mt,
    mr,
    mb,
    ml,
    className,
    ...props
}) => {
    const spacing = resolveTypographySpacing({ m, mv, mh, mt, mr, mb, ml });

    return (
        <hr
            aria-orientation={orientation}
            data-appearance-variant="default"
            data-appearance-color={color}
            className={classNames(
                styles["divider"],
                styles[orientation],
                spacing.marginTop && styles[`margin-top-${spacing.marginTop}`],
                spacing.marginRight &&
                    styles[`margin-right-${spacing.marginRight}`],
                spacing.marginBottom &&
                    styles[`margin-bottom-${spacing.marginBottom}`],
                spacing.marginLeft &&
                    styles[`margin-left-${spacing.marginLeft}`],
                className,
            )}
            {...props}
        />
    );
};
