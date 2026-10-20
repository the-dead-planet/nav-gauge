import { ComponentProps, FC } from 'react';
import { DEFAULT_SIZE, TileProps } from '@ui';
import classNames from 'classnames';
import { Panel } from '../../hud/panel';
import styles from './tile.module.css';

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
    const { className, ...restPanelProps } = panelProps;

    return (
        <Panel
            {...restPanelProps}
            className={classNames(styles.tile, className)}
        >
            <article className={styles.article} aria-label={name}>
                <div className={styles.body}>
                    <header className={classNames(styles.header, styles[`padding-${size}`])}>
                        <div className={styles['title-row']}>
                            <span className={styles.title}>{name}</span>
                            {append}
                        </div>
                    </header>
                    {description || children ? (
                        <div className={classNames(styles.content, styles[`padding-${size}`])}>
                            {description ? (
                                <span className={styles.description}>
                                    {description}
                                </span>
                            ) : null}
                            {children}
                        </div>
                    ) : null}
                </div>
                {actions ? (
                    <footer className={styles.actions}>{actions(size)}</footer>
                ) : null}
            </article>
        </Panel>
    );
};
