import { AnimationControlsType } from "../animatrix";
import { GaugeControlsType, MapLayout } from "../cartomancer";

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
