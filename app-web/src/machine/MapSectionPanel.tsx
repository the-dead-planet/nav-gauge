import { FC } from "react";
import classNames from "classnames";
import { Button, H3, Transition } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";
import styles from './map-section.module.css';
import { Icons, TooltipPlacement, TransitionProps } from "@ui";
import { T } from "@web-apparatus";

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
    const { namespace, translationKey, toolsStation, translatron, individuator } = useMachineWard();
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
    const showHeaders = effectivePanels.length > (placement === 'bottom' ? 0 : 0);
    const color = placement === 'bottom' ? 'primary' : 'secondary';
    const buttonSize = placement === 'bottom' ? 'sm' : 'md';

    const headers = showHeaders ? (
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
                        onClick={() => onActiveIdChange(id)}
                    />
                );
            })}
            <Button
                size={buttonSize}
                variant='ghost'
                color={color}
                icon={Icons.NounProject.ChevronDownDouble}
                iconRotateZ={((placement === 'bottom'
                    ? 0
                    : placement === 'left'
                        ? 90
                        : -90) + (activeId === null ? 180 : 0) + 360) % 360}
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
                style={placement === 'bottom' ? { marginLeft: 'auto' } : { marginTop: 'auto' }}
            />
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
                    {placement !== 'left' ? headers : null}
                    <div className={styles['component']}>
                        {toolPanel ? (
                            <>
                                <H3><T {...toolPanel.title} /></H3>
                                <toolPanel.component map={map} />
                            </>
                        ) : null}
                    </div>
                    {placement === 'left' ? headers : null}
                </div>
            </Transition>
        </div>
    );
};
