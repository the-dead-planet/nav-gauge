import { FC } from 'react';
import classNames from 'classnames';
import {
    DEFAULT_COLOR,
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
        variant,
    };

    return (
        <div className={styles['root']}>
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
                        className={styles['tab']}
                        role="tab"
                        aria-selected={option.value === value}
                        highlighted={highlighted || option.value === value}
                        disabled={disabled || option.disabled}
                        onClick={() => onChange(option.value)}
                    >
                        <span className={styles['label']}>{option.label}</span>
                    </Button>
                ))}
                {overflowOptions.length ? (
                    <Menu
                        {...buttonProps}
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
                                highlighted={
                                    highlighted || option.value === value
                                }
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
                            styles[`size-${size}`],
                        )}
                    >
                        {children}
                    </HudSurface>
                </div>
            ) : null}
        </div>
    );
};
