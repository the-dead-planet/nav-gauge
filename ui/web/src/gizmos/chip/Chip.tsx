import { FC } from "react";
import classNames from "classnames";
import {
    ChipProps,
    DEFAULT_COLOR,
    DEFAULT_SURFACE_VARIANT,
    DEFAULT_SIZE,
    DEFAULT_FILL_VARIANT,
    useTheme,
} from "@ui";
import { Icon } from "../../design-system/icons";
import { Tooltip } from "../tooltip";
import { Span } from "../../design-system/typography";
import { usePanelDimensions } from "../../hud/usePanelDimensions";
import { OctagonalSurface } from "../../hud/octagonal-panel/OctagonalSurface";
import { HudSurface } from "../../hud/HudSurface";
import styles from "./chip.module.css";

interface Props {
    /**
     * Icon source path, e.g. `Icons.NounProject.UnderConstruction`
     */
    icon?: string;
    className?: string;
}

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
        <HudSurface
            as="span"
            ref={containerRef}
            variant={variant}
            size={size}
            color={color}
            className={classNames(styles["chip"], className)}
        >
            {width > 0 && height > 0 ? (
                <OctagonalSurface
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
                        width={theme.sizes.control[size].iconSize}
                        height={theme.sizes.control[size].iconSize}
                    />
                ) : null}
                {children !== undefined && children !== null ? (
                    <Span fontType={fontType} className={styles.label}>
                        {children}
                    </Span>
                ) : null}
            </span>
        </HudSurface>
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
