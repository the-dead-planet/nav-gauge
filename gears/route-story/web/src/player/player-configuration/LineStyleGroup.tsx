import { FC } from "react";
import { DropdownOption } from "@ui";
import { RouteStoryLineStyle } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Checkbox, Dropdown, Fieldset, Label, NumberInput } from "@web-ui";
import { ColorSelectField } from "./ColorSelectField";
import styles from './line-style-group.module.css';

interface Props {
    label: string;
    style: RouteStoryLineStyle;
    linesLabel: string;
    pointsLabel: string;
    colorLabel: string;
    widthLabel: string;
    outlineColorLabel: string;
    outlineWidthLabel: string;
    solidLabel: string;
    dashedLabel: string;
    lineStyleLabel: string;
    lineLabel: string;
    outlineLabel: string;
    onChange: (patch: Partial<RouteStoryLineStyle>) => void;
}

export const LineStyleGroup: FC<Props> = ({
    label,
    style,
    linesLabel,
    pointsLabel,
    lineStyleLabel,
    lineLabel,
    outlineLabel,
    solidLabel,
    dashedLabel,
    onChange
}) => {
    const variantOptions: DropdownOption<'solid' | 'dashed'>[] = [
        { label: solidLabel, value: 'solid' as const },
        { label: dashedLabel, value: 'dashed' as const },
    ].filter((option) => option.label != null);

    return (
        <Fieldset size="xs" label={label}>
            <div className={styles['top-controls']}>
                <Checkbox size="xs" checked={style.showRouteLine} onChange={(checked) => onChange({ showRouteLine: checked })}>
                    {linesLabel}
                </Checkbox>
                <Checkbox size="xs" checked={style.showRoutePoints} onChange={(checked) => onChange({ showRoutePoints: checked })}>
                    {pointsLabel}
                </Checkbox>
                <Label>{lineStyleLabel}</Label>
                <Dropdown size="xs" value={style.variant} options={variantOptions} onChange={(variant) => onChange({ variant })} />
            </div>
            <Label>{lineLabel}</Label>
            <div className={styles['grid']}>
                <ColorSelectField value={style.color} onChange={(color) => onChange({ color })} />
                <NumberInput size="xs" min={1} max={8} step={1} value={style.width} onChange={(width) => onChange({ width })} unit="px" />
            </div>
            <Label>{outlineLabel}</Label>
            <div className={styles['grid']}>
                <ColorSelectField value={style.outlineColor} onChange={(outlineColor) => onChange({ outlineColor })} />
                <NumberInput size="xs" min={0} max={4} step={1} value={style.outlineWidth} onChange={(outlineWidth) => onChange({ outlineWidth })} unit="px" />
            </div>
        </Fieldset>
    );
};
