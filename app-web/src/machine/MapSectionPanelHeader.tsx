import { FC } from "react";
import { Button } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";
import { Icons, TooltipPlacement, } from "@ui";
import styles from './map-section.module.css';

interface Props {
    placement: ToolPanelPlacement;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const MapSectionPanelHeader: FC<Props> = ({
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
    const color = 'secondary';
    const buttonSize = 'md';

    // TODO: Allow changing from one panel at a time to all listed in collapsible sections?
    // TODO: Allow manual resize
    return (
        <div className={styles['content-header']}>
            {effectivePanels.map(({ id, icon, title, }) => {
                const tooltip = translatron.translate(settings.language, registry, title);
                const isActive = activeId === id;

                return (
                    <Button
                        key={id}
                        size={buttonSize}
                        variant={isActive ? 'outline' : 'ghost'}
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
            <span className={styles['spacer-line']} />
            <Button
                size={buttonSize}
                variant='ghost'
                color={color}
                icon={Icons.NounProject.ChevronDownDouble}
                iconRotateZ={((placement === 'left' ? 90 : -90) + (activeId === null ? 180 : 0) + 360) % 360}
                aria-label={translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse })}
                tooltip={translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse })}
                tooltipPlacement={tooltipPlacement[placement]}
                onClick={() => {
                    if (activeId !== null) {
                        onActiveIdChange(null);
                    } else {
                        onActiveIdChange(effectivePanels[0]?.id)
                    }
                }}
                style={{ marginTop: 'auto' }}
            />
        </div>
    );
};
