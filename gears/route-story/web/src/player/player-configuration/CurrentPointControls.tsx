import { FC } from "react";
import { useMultipleTranslations } from "@apparatus";
import { currentPointSizeOptions, CurrentPointStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button, Fieldset, Radio } from "@web-ui";
import { ColorSelectField } from "./ColorSelectField";
import styles from './current-point-controls.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    value: CurrentPointStyle;
    onChange: (patch: Partial<CurrentPointStyle>) => void;
}

export const CurrentPointControls: FC<Props> = ({ gearId, translationKey, value, onChange }) => {
    const [currentPointLabel, colorLabel, outlineColorLabel, sizeLabel, shapeLabel, circleLabel, triangleLabel] = useMultipleTranslations([
        { n: gearId, t: translationKey.CurrentPoint },
        { n: gearId, t: translationKey.Color },
        { n: gearId, t: translationKey.OutlineColor },
        { n: gearId, t: translationKey.Size },
        { n: gearId, t: translationKey.Shape },
        { n: gearId, t: translationKey.Circle },
        { n: gearId, t: translationKey.Triangle },
    ]);

    return (
        <Fieldset size="xs" label={currentPointLabel}>
            <ColorSelectField label={colorLabel} value={value.fillColor} onChange={(fillColor) => onChange({ fillColor })} />
            <ColorSelectField label={outlineColorLabel} value={value.outlineColor} onChange={(outlineColor) => onChange({ outlineColor })} />
            <span className={styles['control-label']}>{sizeLabel}</span>
            <div className={styles['size-row']}>
                {currentPointSizeOptions.map((option) => (
                    <Button key={option.label} size="xs" active={value.size === option.radius} onClick={() => onChange({ size: option.radius })}>
                        {option.label}
                    </Button>
                ))}
            </div>
            <span className={styles['control-label']}>{shapeLabel}</span>
            <Radio size="xs" checked={value.shape.type === 'simple' && value.shape.shape === 'circle'} onChange={(checked) => {
                if (checked) {
                    onChange({ shape: { type: 'simple', shape: 'circle' } });
                }
            }}>
                {circleLabel}
            </Radio>
            <Radio size="xs" checked={value.shape.type === 'simple' && value.shape.shape === 'triangle'} onChange={(checked) => {
                if (checked) {
                    onChange({ shape: { type: 'simple', shape: 'triangle' } });
                }
            }}>
                {triangleLabel}
            </Radio>
        </Fieldset>
    );
};