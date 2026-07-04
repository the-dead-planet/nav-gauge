import { FC, useId } from "react";
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

export const MapSectionBottomPanelHeader: FC<Props> = ({
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
    const color = 'primary';
    const buttonSize = 'sm';
    const clipId = useId();

    // TODO: Allow changing from one panel at a time to all listed in collapsible sections?
    // TODO: Allow manual resize
    return (
        <div className={styles['content-header']}>
            <div className={styles['bezier-spacer']} />

            <div className={styles['header-content']}>
                <div className={styles['bottom-header-content-background']} />
                <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={styles['curve-left']}>
                    <path
                        d="M0,98 C60,100 40,0 105,5 L105,100 L0,100 Z"
                        fill="var(--toolbar-background-color)"
                        stroke="none"
                    />
                    <path
                        d="M0,96 C60,100 40,0 100,4"
                        fill="none"
                        stroke="var(--color-primary)"
                        stroke-width="7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                {effectivePanels.map(({ id, icon, title, }) => {
                    const tooltip = translatron.translate(settings.language, registry, title);
                    const isActive = activeId === id;

                    return (
                        <Button
                            key={id}
                            size={buttonSize}
                            variant={isActive && placement !== 'bottom' ? 'outline' : 'ghost'}
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

                <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={styles['curve-right']}>
                    <path
                        d="M100,98 C40,100 60,0 0,5 L0,100 L100,100 Z"
                        fill="var(--toolbar-background-color)"
                        stroke="none"
                    />
                    <path
                        d="M100,96 C40,100 60,0 0,4"
                        fill="none"
                        stroke="var(--color-primary)"
                        stroke-width="7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>

            <div className={styles['bezier-spacer']} />
        </div>
    );
};
