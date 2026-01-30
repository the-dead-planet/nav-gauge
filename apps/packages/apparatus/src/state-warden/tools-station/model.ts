import { ComponentType } from "react";
import { BehaviorSubject } from "rxjs";
import { AnimationControlsType } from "../animatrix";
import { GaugeControlsType, MapLayout } from "../cartomancer";

export type ToolPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface ToolProps {
    map: maplibregl.Map;
}

export interface Tool {
    placement$: BehaviorSubject<ToolPlacement>;
    component: ComponentType<ToolProps>;
}

export type Preset = 'default' | 'racing-game';

export interface PresetOption {
    value: Preset;
    label: string;
    mapLayout: MapLayout;
    gaugeControls: GaugeControlsType;
    animationControls: AnimationControlsType;
}

export interface PresetValues {
    presetMapLayout?: MapLayout;
    presetGaugeControls?: GaugeControlsType;
    presetAnimationControls?: AnimationControlsType;
}
