import { FC } from "react";
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
    className,
    children,
}) => {
    const theme = useTheme();

    const chip = (
        <span className={classNames(
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
