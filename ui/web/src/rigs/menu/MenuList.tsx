import { ComponentProps } from "react";
import classNames from "classnames";
import { DEFAULT_COLOR, DEFAULT_SIZE, MenuListProps } from "@ui";
import { HudSurface } from "../../hud/HudSurface";
import styles from "./menu.module.css";

type Props = MenuListProps &
    Omit<ComponentProps<"div" | "ul">, keyof MenuListProps> & {
        as: "div" | "ul";
    };

export function MenuList({
    as,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    className,
    ...props
}: Props) {
    return (
        <HudSurface
            {...props}
            as={as}
            variant="fill-inverse"
            color={color}
            data-size={size}
            rectangle
            className={classNames(
                styles["menu-list"],
                styles[`size-${size}`],
                className,
            )}
        />
    );
}
