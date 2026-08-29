import { FC, MouseEvent } from "react";
import classNames from "classnames";
import { ChipProps, SizeVariant, useTheme } from "@ui";
import { Icon } from "../icons";
import { Tooltip } from "../tooltip";
import styles from './chip.module.css';

interface Props {
    /**
     * Icon source path, e.g. `Icons.NounProject.UnderConstruction`
     */
    icon?: string;
    ariaLabel?: string;
    onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
    className?: string;
}

const iconSizes: Record<SizeVariant, number> = {
    xs: 12,
    sm: 16,
    md: 20,
};

export const Chip: FC<ChipProps & Props> = ({
    color = 'neutral',
    icon,
    size = 'sm',
    variant = 'fill',
    tooltip,
    tooltipPlacement,
    tooltipVariant = 'fill-inverse',
    showTooltipConnection,
    ariaLabel,
    onClick,
    className,
    children,
}) => {
    const theme = useTheme();

    const chip = (
        <span
            aria-label={ariaLabel}
            tabIndex={onClick ? 0 : undefined}
            role={onClick ? "button" : undefined}
            onClick={onClick}
            className={classNames(
                styles['chip'],
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`size-${size}`],
                styles[`variant-${variant}`],
                {
                    [styles['interactive']]: !!onClick,
                },
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
