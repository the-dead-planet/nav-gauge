import { FC } from "react";
import classNames from "classnames";
import { ChipProps, SizeVariant } from "@ui";
import { Icon } from "../icons";
import { Tooltip } from "../tooltip";
import styles from './chip.module.css';

interface Props {
    /**
     * Icon source path, e.g. `Icons.NounProject.UnderConstruction`
     */
    icon?: string;
}

const iconSizes: Record<SizeVariant, number> = {
    xs: 12,
    sm: 16,
    md: 20,
};

export const Chip: FC<ChipProps & Props> = ({
    color = 'warning',
    icon,
    size = 'sm',
    variant = 'fill',
    tooltip,
    tooltipPlacement,
    tooltipVariant = 'fill-inverse',
    showTooltipConnection,
    children,
}) => {
    const chip = (
        <span className={classNames(
            styles['chip'],
            styles[`color-${color}`],
            styles[`size-${size}`],
            styles[`variant-${variant}`],
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
