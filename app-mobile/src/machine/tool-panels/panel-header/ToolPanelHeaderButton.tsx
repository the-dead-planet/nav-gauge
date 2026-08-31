import { FC } from "react";
import { Button, MobileButtonProps } from "@mobile-ui";
import { ObservedToolPanel, useTranslation } from "@apparatus";
import { ButtonProps, TooltipPlacement } from "@ui";

interface Props {
    toolPanel: ObservedToolPanel<unknown>;
    variant: ButtonProps['variant'];
    color: ButtonProps['color'];
    buttonSize: ButtonProps['size'];
    tooltipPlacement: TooltipPlacement;
    isActive: boolean;
    onPress: () => void;
}

export const ToolPanelHeaderButton: FC<Props> = ({
    toolPanel: { id, title, icon },
    variant,
    color,
    buttonSize,
    tooltipPlacement,
    isActive,
    onPress,
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
            icon={icon as unknown as MobileButtonProps['icon']}
            accessibilityLabel={tooltip}
            tooltip={tooltip}
            tooltipPlacement={tooltipPlacement}
            showTooltipConnection
            onPress={onPress}
        />
    );
};
