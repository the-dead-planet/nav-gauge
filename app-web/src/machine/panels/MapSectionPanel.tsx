import { FC } from "react";
import classNames from "classnames";
import { H3, Transition } from "@web-ui";
import { useObservableState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";
import { TransitionProps } from "@ui";
import { T } from "@web-apparatus";
import { MapSectionSidePanelHeader } from "./MapSectionSidePanelHeader";
import { MapSectionBottomPanelHeader } from "./bottom/MapSectionBottomPanelHeader";
import styles from '../map-section.module.css';

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
    const { toolsStation } = useMachineWard();
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement[placement];
    const toolPanel = effectivePanels.find(({ id }) => id === activeId);
    const slide: { [key in ToolPanelPlacement]: TransitionProps['slide'] } = {
        left: "to-right",
        right: "to-left",
        bottom: "to-top",
    };
    const showHeader = effectivePanels.length > (placement === 'bottom' ? 0 : 0)

    const sideHeader = showHeader ? (
        <MapSectionSidePanelHeader placement={placement} activeId={activeId} onActiveIdChange={onActiveIdChange} />
    ) : null;

    // TODO: Allow changing from one panel at a time to all listed in collapsible sections?
    // TODO: Allow manual resize
    return (
        <div className={classNames(styles['toolbar'], styles[placement])}>
            <Transition slide={slide[placement]} fade render={effectivePanels.length > 0}>
                <div className={classNames(styles['content'], {
                    [styles['with-header']]: showHeader,
                })}>
                    {placement === 'bottom' ? <MapSectionBottomPanelHeader placement={placement} activeId={activeId} onActiveIdChange={onActiveIdChange} /> : null}
                    {placement === 'right' ? sideHeader : null}
                    {toolPanel ? (
                        <div className={styles['component']}>
                            {placement !== 'bottom' ? (
                                <H3 m="sm">
                                    <T {...toolPanel.title} />
                                </H3>
                            ) : null}
                            <toolPanel.component map={map} />
                        </div>
                    ) : null}
                    {placement === 'left' ? sideHeader : null}
                </div>
            </Transition>
        </div>
    );
};
