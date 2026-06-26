import { FC } from "react";
import classNames from "classnames";
import styles from './map-section.module.css';
import { Button, Transition } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";

interface Props {
    placement: ToolPanelPlacement;
    map?: maplibregl.Map;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const ToolPanel: FC<Props> = ({
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

    return (
        <div className={classNames(styles['toolbar'], styles[placement])}>
            <Transition slide="to-top" render={effectivePanels.length > 0}>
                <div className={styles['content']}>
                    {effectivePanels.length > 1 ? (
                        <div className={styles['content-header']}>
                            {effectivePanels.map(({ id, icon, title, }) => {
                                const tooltip = translatron.translate(settings.language, registry, title);

                                return (
                                    <Button
                                        size="sm"
                                        variant={activeId === id ? 'outline' : 'ghost'}
                                        color="primary"
                                        active={activeId === id}
                                        icon={icon}
                                        aria-label={tooltip}
                                        tooltip={tooltip}
                                        tooltipPlacement="top"
                                        onClick={() => onActiveIdChange(id)}
                                    />
                                );
                            })}
                        </div>
                    ) : null}
                    {toolPanel ? <toolPanel.component map={map} /> : null}
                </div>
            </Transition>
        </div>
    );
};
