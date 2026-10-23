import { FC } from "react";
import classNames from "classnames";
import { ChipProps, DEFAULT_FILL_VARIANT, DEFAULT_SIZE, SizeVariant, useTheme } from "@ui";
import { Icon } from "../../design-system/icons";
import { Tooltip } from "../tooltip";
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
    color = 'neutral',
    icon,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    tooltip,
    tooltipPlacement,
    tooltipVariant = 'fill-inverse',
    showTooltipConnection,
    className,
    children,
}) => {
    const theme = useTheme();

    const chip = (
        <span
            data-appearance-variant={variant === 'ghost' ? variant : undefined}
            data-appearance-color={variant === 'ghost' ? color : undefined}
            className={classNames(
                styles['chip'],
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`size-${size}`],
                styles[`variant-${variant}`],
                className,
            )}>
            {icon ? <Icon src={icon} width={iconSizes[size]} height={iconSizes[size]} /> : null}
            {children !== undefined && children !== null ? <span>{children}</span> : null}
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
