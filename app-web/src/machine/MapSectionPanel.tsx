import { FC } from "react";
import classNames from "classnames";
import { H3, Transition } from "@web-ui";
import { useObservableState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";
import { TransitionProps } from "@ui";
import { T } from "@web-apparatus";
import { MapSectionPanelHeader } from "./MapSectionPanelHeader";
import styles from './map-section.module.css';
import { MapSectionBottomPanelHeader } from "./MapSectionBottomPanelHeader";

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
        <MapSectionPanelHeader placement={placement} activeId={activeId} onActiveIdChange={onActiveIdChange} />
    ) : null;

    // TODO: Allow changing from one panel at a time to all listed in collapsible sections?
    // TODO: Allow manual resize
    return (
        <div className={classNames(styles['toolbar'], styles[placement])}>
            <Transition slide={slide[placement]} render={effectivePanels.length > 0}>
                <div className={classNames(styles['content'], {
                    [styles['with-header']]: showHeader,
                })}>
                    {placement === 'bottom' ? <MapSectionBottomPanelHeader placement={placement} activeId={activeId} onActiveIdChange={onActiveIdChange} /> : null}
                    {placement === 'right' ? sideHeader : null}
                    <div className={styles['component']}>
                        {toolPanel ? (
                            <>
                                {placement !== 'bottom' ? <H3 m="sm"><T {...toolPanel.title} /></H3> : null}
                                <toolPanel.component map={map} />
                            </>
                        ) : null}
                    </div>
                    {placement === 'left' ? sideHeader : null}
                </div>
            </Transition>
        </div>
    );
};
