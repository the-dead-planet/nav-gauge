import { ComponentType } from "react";
import { BehaviorSubject } from "rxjs";
import { AnimationControlsType } from "../animatrix";
import { GaugeControlsType, MapLayout } from "../cartomancer";

export type ToolPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface ToolProps<TMap> {
    map: TMap;
}

export interface Tool<TMap> {
    placement$: BehaviorSubject<ToolPlacement>;
    component: ComponentType<ToolProps<TMap>>;
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

export interface ControlComponentProps {
    
}

export interface ObservedTool<TMap> {
    id: string;
    placement: ToolPlacement;
    component: ComponentType<ToolProps<TMap>>;
}