import { FC } from "react";
import classNames from "classnames";
import { ChipProps, DEFAULT_COLOR, DEFAULT_SURFACE_VARIANT, DEFAULT_SIZE, SizeVariant } from "@ui";
import { Icon } from "../../design-system/icons";
import { Tooltip } from "../tooltip";
import { Span } from '../../design-system/typography';
import styles from './chip.module.css';

interface Props {
    /**
     * Icon source path, e.g. `Icons.NounProject.UnderConstruction`
     */
    icon?: string;
    className?: string;
}

const iconSizes: Record<SizeVariant, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
};

export const Chip: FC<ChipProps & Props> = ({
    color = DEFAULT_COLOR,
    fontType,
    icon,
    size = DEFAULT_SIZE,
    variant = DEFAULT_SURFACE_VARIANT,
    tooltip,
    tooltipPlacement,
    tooltipVariant = 'fill-inverse',
    showTooltipConnection,
    className,
    children,
}) => {
    const chip = (
        <span
            data-appearance-variant={variant}
            data-appearance-color={color}
            className={classNames(
                styles['chip'],
                styles[`size-${size}`],
                className,
            )}>
            {icon ? <Icon src={icon} width={iconSizes[size]} height={iconSizes[size]} /> : null}
            {children !== undefined && children !== null ? (
                <Span fontType={fontType} className={styles.label}>{children}</Span>
            ) : null}
        </span>
    );

    if (tooltip) {
        return (
            <Tooltip
                placement={tooltipPlacement}
                content={tooltip}
                variant={tooltipVariant}
                showConnection={showTooltipConnection}
            >
                {chip}
            </Tooltip>
        );
    }

    return chip;
};
