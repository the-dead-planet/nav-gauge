import { FC } from "react";
import classNames from "classnames";
import { Button, Transition } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";
import styles from './map-section.module.css';
import { TooltipPlacement, TransitionProps } from "@ui";

interface Props {
    placement: ToolPanelPlacement;
    map?: maplibregl.Map;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const MapSectionPanel: FC<Props> = ({
    placement,
    map,
    activeId,
    onActiveIdChange,
}) => {
    const { toolsStation, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement[placement];
    const toolPanel = effectivePanels.find(({ id }) => id === activeId);
    const slide: { [key in ToolPanelPlacement]: TransitionProps['slide'] } = {
        left: "to-right",
        right: "to-left",
        bottom: "to-top",
    };
    const tooltipPlacement: { [key in ToolPanelPlacement]: TooltipPlacement } = {
        left: "right",
        right: "left",
        bottom: "top",
    };
    const showHeaders = effectivePanels.length > 1;

    const headers = showHeaders ? (
                        <div className={styles['content-header']}>
                            {effectivePanels.map(({ id, icon, title, }) => {
                                const tooltip = translatron.translate(settings.language, registry, title);

                                return (
                                    <Button
                                        key={id}
                                        size="md"
                                        variant={activeId === id ? 'outline' : 'ghost'}
                                        color="primary"
                                        active={activeId === id}
                                        icon={icon}
                                        aria-label={tooltip}
                                        tooltip={tooltip}
                                        tooltipPlacement={tooltipPlacement[placement]}
                                        showTooltipConnection
                                        onClick={() => onActiveIdChange(id)}
                                    />
                                );
                            })}
                        </div>
                    ) : null;

    // TODO: Allow changing from one panel at a time to all listed in collapsible sections?
    // TODO: Allow manual resize
    return (
        <div className={classNames(styles['toolbar'], styles[placement])}>
            <Transition slide={slide[placement]} render={effectivePanels.length > 0}>
                <div className={classNames(styles['content'], {
                    [styles['with-header']]: showHeaders
                })}>
                    {placement === 'right' ? headers : null}
                    {toolPanel ? <toolPanel.component map={map} /> : null}
                    {placement === 'left' ? headers : null}
                </div>
            </Transition>
        </div>
    );
};
