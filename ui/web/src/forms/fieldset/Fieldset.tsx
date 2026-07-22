import { FC, useState } from "react"
import classNames from "classnames";
import { FieldsetProps } from "@ui";
import styles from './fieldset.module.css';

export const Fieldset: FC<Omit<FieldsetProps, 'expanded' | 'onExpandedChange'> & {
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    className?: string;
}> = ({
    label,
    prepend,
    size = 'md',
    expandable,
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
            <fieldset className={classNames(styles.fieldset, styles[`size-${size}`], className)}>
                <legend
                    className={classNames(styles.legend, { [styles['legend-expandable']]: expandable })}
                    onClick={expandable ? handleToggle : undefined}
                >
                    {prepend && <span className={styles['prepend']}>{prepend}</span>}
                    <span className={styles['label']}>{label}</span>
                    {expandable && (
                        <span className={classNames(styles['chevron'], { [styles['chevron-expanded']]: isExpanded })}>
                            {'›'}
                        </span>
                    )}
                </legend>
                {(!expandable || isExpanded) && (
                    <div className={styles['content']}>
                        {children}
                    </div>
                )}
            </fieldset>
        );
    };
