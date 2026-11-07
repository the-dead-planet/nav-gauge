import { ComponentProps, FC } from "react";
import {
    actionButtonVariants,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    TileProps,
} from "@ui";
import classNames from "classnames";
import { Panel } from "../../hud/panel";
import styles from "./tile.module.css";

interface Props extends TileProps {
    panelProps?: ComponentProps<typeof Panel>;
}

export const Tile: FC<Props> = ({
    name,
    size = DEFAULT_SIZE,
    append,
    description,
    actions,
    children,
    panelProps = {},
}) => {
    const {
        className,
        elevation = "raised",
        elevationLayer,
        ...surfaceProps
    } = panelProps;
    const depth = elevationLayer ? { elevationLayer } : { elevation };
    const actionVariants =
        actionButtonVariants[panelProps.variant ?? DEFAULT_FILL_VARIANT];

    return (
        <Panel
            {...surfaceProps}
            {...depth}
            className={classNames(styles.tile, className)}
        >
            <article className={styles.article} aria-label={name}>
                <div
                    className={classNames(
                        styles.body,
                        styles[`padding-${size}`],
                    )}
                >
                    <header className={styles.header}>
                        <h3 className={styles.title}>{name}</h3>
                        {append}
                    </header>
                    {description || children ? (
                        <div className={styles.content}>
                            {description ? (
                                <p className={styles.description}>
                                    {description}
                                </p>
                            ) : null}
                            {children}
                        </div>
                    ) : null}
                </div>
                {actions ? (
                    <footer className={styles.actions}>
                        {actions(size, actionVariants)}
                    </footer>
                ) : null}
            </article>
        </Panel>
    );
};
