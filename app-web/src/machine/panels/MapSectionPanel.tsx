import { FC } from "react";
import classNames from "classnames";
import { Menu, MenuItem, Transition } from "@web-ui";
import { useObservableState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard, useMultipleTranslations } from "@apparatus";
import { TransitionProps } from "@ui";
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
    const { toolsStation, namespace, translationKey } = useMachineWard();
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement[placement];
    const toolPanel = effectivePanels.find(({ id }) => id === activeId);
    const targetPlacement = toolPanel?.placement === 'right' ? 'left' : 'right';
    const slide: { [key in ToolPanelPlacement]: TransitionProps['slide'] } = {
        left: "to-right",
        right: "to-left",
        bottom: "to-top",
    };
    const showHeader = effectivePanels.length > (placement === 'bottom' ? 0 : 0)

    const sideHeader = showHeader ? (
        <MapSectionSidePanelHeader placement={placement} activeId={activeId} onActiveIdChange={onActiveIdChange} />
    ) : null;

    const [
        panelMenuLabel,
        swapPlacementLabel,
    ] = useMultipleTranslations([
        { n: namespace, t: translationKey.PanelMenu },
        { n: namespace, t: translationKey.SwapPlacement, p: { placement: targetPlacement } },
    ]);

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
                            {toolPanel.placement !== 'bottom' || toolPanel?.headerComponent ? (
                                <div className={styles['component-header']}>
                                    {toolPanel.headerComponent ? <toolPanel.headerComponent map={map} placement={toolPanel.placement} /> : null}
                                    {toolPanel.placement !== 'bottom' ? (
                                        <Menu
                                            aria-label={panelMenuLabel}
                                            tooltip={panelMenuLabel}
                                            tooltipPlacement="bottom"
                                            placement={toolPanel.placement === "right" ? "bottom-right" : "bottom-left"}
                                            iconActiveColor="secondary"
                                            iconSize="xs"
                                        // menuListClassName={styles['menu']}
                                        >
                                            <MenuItem
                                                key="swap-placement"
                                                isFirst
                                                type="button"
                                                closeOnPress
                                                onClick={() => {
                                                    if (toolPanel.placement === 'right') {
                                                        toolsStation.updateToolPanelPlacement(toolPanel.id, 'left');
                                                        toolsStation.activeLeftPanelToolId$.next(toolPanel.id);
                                                    } else {
                                                        toolsStation.updateToolPanelPlacement(toolPanel.id, 'right');
                                                        toolsStation.activeRightPanelToolId$.next(toolPanel.id);
                                                    }
                                                }}
                                            >
                                                {swapPlacementLabel}
                                            </MenuItem>
                                        </Menu>
                                    ) : null}
                                </div>
                            ) : null}
                            <div className={styles['component-content']}>
                                <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                            </div>
                        </div>
                    ) : null}
                    {placement === 'left' ? sideHeader : null}
                </div>
            </Transition>
        </div>
    );
};
