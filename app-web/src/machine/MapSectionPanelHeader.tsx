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
    const color = placement === 'bottom' ? 'primary' : 'secondary';
    const buttonSize = placement === 'bottom' ? 'sm' : 'md';
    const isBottom = placement === 'bottom';
    const clipId = useId();

    const buttons = (
        <>
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
            {placement !== 'bottom' ? <span className={styles['spacer-line']} /> : null}
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
        </>
    );

    return (
        <div className={styles['content-header']}>
            {isBottom ? (
                <>
                    <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    >
                        <path d="M0,100 C60,100 40,0 100,0"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth={5}
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                        />
                    </svg>
                    <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            transform: 'scaleX(-1)',
                        }}
                    >
                        <path d="M0,100 C60,100 40,0 100,0"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth={5}
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div style={{
                        position: 'absolute',
                        top: 28,
                        left: 0,
                        bottom: 0,
                        width: 2,
                        backgroundColor: 'var(--color-primary)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: 28,
                        right: 0,
                        bottom: 0,
                        width: 2,
                        backgroundColor: 'var(--color-primary)',
                    }} />
                    <svg width="0" height="0" style={{ position: 'absolute' }}>
                        <defs>
                            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                                <path d="M0,1 C0.6,1 0.4,0 1,0 L1,1 Z" />
                            </clipPath>
                        </defs>
                    </svg>
                    <div className={styles['header-content']}
                        style={{ clipPath: `url(#${clipId})` } as React.CSSProperties}
                    >
                        {buttons}
                    </div>
                </>
            ) : (
                buttons
            )}
        </div>
    );
};
