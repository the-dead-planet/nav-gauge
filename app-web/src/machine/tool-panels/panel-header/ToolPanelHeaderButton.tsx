import { FC } from "react";
import { Button } from "@web-ui";
import { ObservedToolPanel, useTranslation } from "@apparatus";
import { ButtonProps, TooltipPlacement, } from "@ui";

interface Props {
    toolPanel: ObservedToolPanel<unknown>;
    variant: ButtonProps['variant'];
    color: ButtonProps['color'];
    buttonSize: ButtonProps['size'];
    tooltipPlacement: TooltipPlacement;
    isActive: boolean;
    onClick: () => void;
}

export const ToolPanelHeaderButton: FC<Props> = ({
    toolPanel: { id, title, icon },
    color,
    variant,
    buttonSize,
    tooltipPlacement,
    isActive,
    onClick,
}) => {
    const tooltip = useTranslation(title);

    return (
        <Button
            key={id}
            size={buttonSize}
            variant={variant}
            color={color}
            highlightColor={color}
            active={isActive}
            icon={icon}
            aria-label={tooltip}
            tooltip={tooltip}
            tooltipPlacement={tooltipPlacement}
            showTooltipConnection
            onClick={onClick}
        />
    );
};
