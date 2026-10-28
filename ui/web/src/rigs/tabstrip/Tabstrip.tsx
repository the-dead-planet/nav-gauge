import { FC } from 'react';
import classNames from 'classnames';
import {
    DEFAULT_COLOR,
    actionButtonVariants,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    Icons,
    TabstripProps,
} from '@ui';
import { Button } from '../../gizmos/button';
import { Menu, MenuItem } from '../menu';
import { HudSurface } from '../../hud/HudSurface';
import styles from './tabstrip.module.css';
import { useTabstripLayout } from './useTabstripLayout';

export const Tabstrip: FC<TabstripProps> = ({
    options,
    value,
    onChange,
    size = DEFAULT_SIZE,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    variant = DEFAULT_FILL_VARIANT,
    highlighted = false,
    disabled = false,
    spread = false,
    overflowAccessibilityLabel,
    actions,
    children,
}) => {
    const {
        containerRef,
        measurementRef,
        contentRef,
        visibleIndexes,
        contentHeight,
        outgoingContent,
    } = useTabstripLayout({ options, value, size, children });

    const visibleOptions = visibleIndexes.map((index) => options[index]);
    const visibleIndexSet = new Set(visibleIndexes);
    const overflowOptions = options.filter(
        (_, index) => !visibleIndexSet.has(index),
    );
    const buttonProps = {
        color,
        glyphsShade,
        highlightColor,
        highlightGlyphsShade,
        size,
        variant: actionButtonVariants[variant].inactive,
    };

    return (
        <div className={styles['root']} data-size={size}>
            <div
                ref={containerRef}
                className={classNames(styles['header'], {
                    [styles['spread']]: spread,
                })}
                role="tablist"
            >
                {visibleOptions.map((option) => (
                    <Button
                        key={option.value}
                        {...buttonProps}
                        variant={
                            actionButtonVariants[variant][
                                highlighted || option.value === value
                                    ? 'active'
                                    : 'inactive'
                            ]
                        }
                        className={styles['tab']}
                        role="tab"
                        aria-selected={option.value === value}
                        highlighted={highlighted}
                        disabled={disabled || option.disabled}
                        onClick={() => onChange(option.value)}
                    >
                        <span className={styles['label']}>{option.label}</span>
                    </Button>
                ))}
                {overflowOptions.length ? (
                    <Menu
                        {...buttonProps}
                        variant={
                            actionButtonVariants[variant][
                                highlighted ||
                                overflowOptions.some(
                                    (option) => option.value === value,
                                )
                                    ? 'active'
                                    : 'inactive'
                            ]
                        }
                        icon={Icons.NounProject.KebabMenu}
                        iconActiveColor={highlightColor}
                        triggerAccessibilityLabel={overflowAccessibilityLabel}
                        triggerActive={overflowOptions.some(
                            (option) => option.value === value,
                        )}
                        disabled={disabled}
                        className={styles['overflow']}
                    >
                        {overflowOptions.map((option) => (
                            <MenuItem
                                key={option.value}
                                type="button"
                                selected={option.value === value}
                                highlighted={highlighted}
                                disabled={disabled || option.disabled}
                                closeOnPress
                                onClick={() => onChange(option.value)}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Menu>
                ) : null}
                <div
                    ref={measurementRef}
                    className={styles['measurement']}
                    aria-hidden="true"
                >
                    {options.map((option) => (
                        <Button
                            key={option.value}
                            {...buttonProps}
                            variant={
                                actionButtonVariants[variant][
                                    highlighted || option.value === value
                                        ? 'active'
                                        : 'inactive'
                                ]
                            }
                            className={styles['tab']}
                            tabIndex={-1}
                        >
                            {option.label}
                        </Button>
                    ))}
                    <Button
                        {...buttonProps}
                        className={styles['overflow']}
                        icon={Icons.NounProject.KebabMenu}
                        tabIndex={-1}
                    />
                </div>
            </div>
            {children !== undefined && children !== null ? (
                <div
                    className={styles['content']}
                    style={{ height: contentHeight }}
                >
                    {outgoingContent?.children !== undefined &&
                    outgoingContent.children !== null ? (
                        <HudSurface
                            as="div"
                            variant={variant}
                            color={color}
                            disabled={disabled}
                            rectangle
                            key={outgoingContent.value}
                            className={classNames(
                                styles['content-inner'],
                                styles['content-outgoing'],
                                actions && styles['with-actions'],
                                styles[`size-${size}`],
                            )}
                            aria-hidden="true"
                            inert
                        >
                            {outgoingContent.children}
                        </HudSurface>
                    ) : null}
                    <HudSurface
                        as="div"
                        variant={variant}
                        color={color}
                        disabled={disabled}
                        rectangle
                        key={value}
                        ref={contentRef}
                        role="tabpanel"
                        className={classNames(
                            styles['content-inner'],
                            actions && styles['with-actions'],
                            styles[`size-${size}`],
                        )}
                    >
                        {children}
                    </HudSurface>
                </div>
            ) : null}
            {actions ? (
                <footer className={styles['footer']}>
                    {actions.secondary ? (
                        <Button
                            {...buttonProps}
                            disabled={disabled}
                            onClick={actions.secondary.onPress}
                        >
                            {actions.secondary.label}
                        </Button>
                    ) : null}
                    <Button
                        {...buttonProps}
                        variant={actionButtonVariants[variant].active}
                        disabled={disabled}
                        onClick={actions.primary.onPress}
                    >
                        {actions.primary.label}
                    </Button>
                </footer>
            ) : null}
        </div>
    );
};
