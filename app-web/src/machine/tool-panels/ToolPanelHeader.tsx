import { FC, ReactNode } from "react";
import { Button } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";
import { Icons, TooltipPlacement, } from "@ui";
import styles from '../machine.module.css';

// TODO: Test decrease tool icon size if isLessThanMd

interface Props {
    placement: ToolPanelPlacement;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
    headerControls?: ReactNode;
}

export const ToolPanelHeader: FC<Props> = ({
    placement,
    activeId,
    onActiveIdChange,
    headerControls,
}) => {
    const { namespace, translationKey, toolsStation, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = placement === "bottom" ? toolPanelsByPlacement["left"].concat(toolPanelsByPlacement["right"]) : toolPanelsByPlacement[placement];
    const tooltipPlacement: { [key in ToolPanelPlacement]: TooltipPlacement } = {
        left: "right",
        right: "left",
        bottom: "top",
    };
    const color = placement === 'bottom' ? 'primary' : 'secondary';
    const buttonSize = placement === 'bottom' ? 'sm' : 'md';
    const expandCollapseLabel = translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse });

    const expandCollapseButton = (
        <Button
            size={buttonSize}
            variant='ghost'
            color={color}
            icon={Icons.NounProject.ChevronDownDouble}
            iconRotateZ={((placement === 'left' ? 90 : placement === "right" ? -90 : 0) + (activeId === null ? 180 : 0) + 360) % 360}
            aria-label={expandCollapseLabel}
            tooltip={expandCollapseLabel}
            tooltipPlacement={tooltipPlacement[placement]}
            onClick={() => {
                if (activeId !== null) {
                    onActiveIdChange(null);
                } else {
                    onActiveIdChange(effectivePanels[0]?.id)
                }
            }}
            className={placement === 'bottom' ? undefined : styles['expand-collapse-button']}
        />
    );

    return (
        <div className={styles['content-header']}>
            {effectivePanels.map(({ id, icon, title, }) => {
                const tooltip = translatron.translate(settings.language, registry, title);
                const isActive = activeId === id;

                return (
                    <Button
                        key={id}
                        size={buttonSize}
                        variant={isActive && placement !== 'left' ? 'outline' : 'ghost'}
                        color={isActive ? color : "neutral"}
                        highlightColor={color}
                        active={isActive}
                        icon={icon}
                        aria-label={tooltip}
                        tooltip={tooltip}
                        tooltipPlacement={tooltipPlacement[placement]}
                        showTooltipConnection
                        onClick={() => onActiveIdChange(activeId === id ? null : id)}
                    />
                );
            })}
            {placement === 'bottom' ? (
                <div className={styles['content-header-controls']}>
                    {headerControls}
                    {expandCollapseButton}
                </div>
            ) : (
                <>
                    <span className={styles['spacer-line']} />
                    {expandCollapseButton}
                </>
            )}
        </div>
    );
};
