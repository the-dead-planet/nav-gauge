import { FC, useState } from "react"
import classNames from "classnames";
import { FieldsetProps, Icons } from "@ui";
import { Icon } from "../../icons";
import styles from './fieldset.module.css';

export const Fieldset: FC<Omit<FieldsetProps, 'expanded' | 'onExpandedChange'> & {
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    className?: string;
}> = ({
    label,
    prepend,
    append,
    size = 'md',
    color = 'neutral',
    expandable = true,
    expanded: controlledExpanded,
    onExpandedChange,
    className,
    children
}) => {
        const [internalExpanded, setInternalExpanded] = useState(true);
        const isExpanded = controlledExpanded ?? internalExpanded;

        const handleToggle = () => {
            onExpandedChange?.(!isExpanded);
            setInternalExpanded(!isExpanded);
        };

        return (
            <fieldset
                className={classNames(
                    styles.fieldset,
                    styles[`size-${size}`],
                    { [styles[`color-${color}`]]: !!color },
                    { [styles.collapsed]: expandable && !isExpanded },
                    className
                )}>
                <legend
                    className={classNames(
                        styles.legend,
                        { [styles['legend-expandable']]: expandable }
                    )}
                    onClick={expandable ? handleToggle : undefined}
                >
                    {expandable && (
                        <span className={classNames(styles['chevron'], { [styles['chevron-expanded']]: isExpanded })}>
                            <Icon src={Icons.NounProject.ChevronDownDoubleTriangle} width={12} height={12} color={`var(--color-${color})`} />
                        </span>
                    )}
                    {prepend && <span className={styles['prepend']}>{prepend}</span>}
                    <span className={styles['label']}>{label}</span>
                    {append && <span className={styles['append']}>{append}</span>}
                </legend>
                {(!expandable || isExpanded) && (
                    <div className={styles['content']}>
                        {children}
                    </div>
                )}
            </fieldset>
        );
    };
