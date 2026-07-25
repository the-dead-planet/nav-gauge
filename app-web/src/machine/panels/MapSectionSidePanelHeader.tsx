import { FC } from "react";
import { Button } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";
import { Icons, TooltipPlacement, } from "@ui";
import styles from '../map-section.module.css';

interface Props {
    placement: ToolPanelPlacement;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const MapSectionSidePanelHeader: FC<Props> = ({
    placement,
    activeId,
    onActiveIdChange,
}) => {
    const { namespace, translationKey, toolsStation, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement[placement];
    const tooltipPlacement: { [key in ToolPanelPlacement]: TooltipPlacement } = {
        left: "right",
        right: "left",
        bottom: "top",
    };
    const color = placement === 'bottom' ? 'primary' : 'secondary';
    const buttonSize = placement === 'bottom' ? 'sm' : 'md';
    const expandCollapseLabel = translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse });

    return (
        <div className={styles['content-header']}>
            {effectivePanels.map(({ id, icon, title, }) => {
                const tooltip = translatron.translate(settings.language, registry, title);
                const isActive = activeId === id;

                return (
                    <Button
                        key={id}
                        size={buttonSize}
                        variant={isActive && placement === 'right' ? 'outline' : 'ghost'}
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
            {placement !== 'bottom' ? <span className={styles['spacer-line']} /> : null}
            <Button
                size={buttonSize}
                variant='ghost'
                color={color}
                icon={Icons.NounProject.ChevronDownDouble}
                iconRotateZ={((placement === 'left' ? 90 : -90) + (activeId === null ? 180 : 0) + 360) % 360}
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
                className={styles['expand-collapse-button']}
            />
        </div>
    );
};
