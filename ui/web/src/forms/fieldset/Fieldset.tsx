import { CSSProperties, FC, useId } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    FieldsetProps,
    Icons,
    useFieldsetExpansion,
} from "@ui";
import { Label } from "../../design-system/typography";
import { Button } from "../../gizmos/button";
import { OctagonalPanel } from "../../hud/octagonal-panel";
import styles from "./fieldset.module.css";

interface Props extends FieldsetProps {
    className?: string;
    style?: CSSProperties;
    contentClassName?: string;
}

export const Fieldset: FC<Props> = ({
    label,
    prepend,
    append,
    size = DEFAULT_SIZE,
    color = DEFAULT_COLOR,
    highlightColor,
    themeMode,
    variant = DEFAULT_SURFACE_VARIANT,
    highlighted = false,
    disabled = false,
    expandable = true,
    expanded,
    onExpandedChange,
    className,
    contentClassName,
    style,
    children,
}) => {
    const identifier = useId();
    const contentId = `${identifier}-content`;
    const { isExpanded, toggle } = useFieldsetExpansion({
        expandable,
        expanded,
        onExpandedChange,
        disabled,
    });

    return (
        <OctagonalPanel
            themeMode={themeMode}
            size={size}
            color={color}
            highlightColor={highlightColor}
            variant={variant}
            highlighted={highlighted}
            disabled={disabled}
            clipContent={false}
            data-size={size}
            className={classNames(styles.frame, className)}
            style={style}
        >
            <fieldset
                className={styles.fieldset}
                data-size={size}
                disabled={disabled}
            >
                <legend className={styles.legend}>
                    {prepend}
                    {expandable ? (
                        <Button
                            icon={Icons.NounProject.ChevronDownDoubleTriangle}
                            iconRotateZ={isExpanded ? 0 : -90}
                            color={color}
                            highlightColor={highlightColor}
                            highlighted={highlighted}
                            disabled={disabled}
                            size={size}
                            variant="ghost"
                            className={styles.disclosure}
                            aria-label={label}
                            aria-expanded={isExpanded}
                            aria-controls={contentId}
                            onClick={toggle}
                        >
                            {label}
                        </Button>
                    ) : (
                        <Label
                            color={color}
                            highlightColor={highlightColor}
                            variant="ghost"
                            highlighted={highlighted}
                            disabled={disabled}
                            uppercase
                            className={styles.caption}
                        >
                            {label}
                        </Label>
                    )}
                    {append ? (
                        <span className={styles.append} inert={disabled}>
                            {append}
                        </span>
                    ) : null}
                </legend>
                <div
                    id={contentId}
                    hidden={!isExpanded}
                    className={classNames(styles.content, contentClassName)}
                >
                    {children}
                </div>
            </fieldset>
        </OctagonalPanel>
    );
};
