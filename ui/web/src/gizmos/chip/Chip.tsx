import { FC } from "react";
import classNames from "classnames";
import {
    ChipProps,
    DEFAULT_COLOR,
    DEFAULT_SURFACE_VARIANT,
    DEFAULT_SIZE,
    DEFAULT_FILL_VARIANT,
    SizeVariant,
    useTheme,
} from "@ui";
import { Icon } from "../../design-system/icons";
import { Tooltip } from "../tooltip";
import { Span } from "../../design-system/typography";
import { usePanelDimensions } from "../../hud/usePanelDimensions";
import { ChipSurface } from "./ChipSurface";
import styles from "./chip.module.css";

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
    tooltipVariant = DEFAULT_FILL_VARIANT,
    showTooltipConnection,
    className,
    children,
}) => {
    const theme = useTheme();
    const appearance = theme.resolveAppearance(variant, color);
    const { containerRef, width, height } =
        usePanelDimensions<HTMLSpanElement>();
    const chip = (
        <span
            ref={containerRef}
            data-appearance-mode={theme.mode}
            data-appearance-variant={variant}
            data-appearance-color={color}
            className={classNames(
                styles["chip"],
                styles[`size-${size}`],
                className,
            )}
        >
            {width > 0 && height > 0 ? (
                <ChipSurface
                    width={width}
                    height={height}
                    size={size}
                    appearance={appearance}
                />
            ) : null}
            <span className={styles.content}>
                {icon ? (
                    <Icon
                        src={icon}
                        width={iconSizes[size]}
                        height={iconSizes[size]}
                    />
                ) : null}
                {children !== undefined && children !== null ? (
                    <Span fontType={fontType} className={styles.label}>
                        {children}
                    </Span>
                ) : null}
            </span>
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
