import { ComponentProps, FC } from "react";
import { TileProps } from "@ui";
import classNames from "classnames";
import { Panel } from "../../hud/panel";
import styles from "./tile.module.css";

interface Props extends TileProps {
  panelProps?: ComponentProps<typeof Panel>;
}

export const Tile: FC<Props> = ({
  name,
  append,
  description,
  actions,
  children,
  panelProps = {},
}) => {
  const { className, ...restPanelProps } = panelProps;

  return (
    <Panel {...restPanelProps} className={classNames(styles.tile, className)}>
      <article className={styles.article} aria-label={name}>
        <div className={styles.body}>
          <header className={styles.header}>
            <div className={styles["title-row"]}>
              <span className={styles.title}>{name}</span>
              {append}
            </div>
          </header>
          {description || children ? (
            <div className={styles.content}>
              {description ? (
                <span className={styles.description}>{description}</span>
              ) : null}
              {children}
            </div>
          ) : null}
        </div>
        {actions ? <footer className={styles.actions}>{actions}</footer> : null}
      </article>
    </Panel>
  );
};
