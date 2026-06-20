import { ComponentType } from "react";
import { BehaviorSubject } from "rxjs";
import { AnimationControlsType } from "../animatrix";
import { GaugeControlsType, MapLayout } from "../cartomancer";
import { TranslationId } from "../translatron";

export type ToolPanelPlacement = 'right' | 'bottom' | 'left';
export type ToolIconPlacement = 'right' | 'left';

export interface ToolPanelProps<TMap> {
    map: TMap;
}

export interface ToolPanel<TMap> {
    icon: string;
    placement$: BehaviorSubject<ToolPanelPlacement>;
    title: TranslationId;
    component: ComponentType<ToolPanelProps<TMap>>;
}

export interface ObservedToolPanel<TMap> {
    id: string;
    icon: string;
    title: TranslationId;
    placement: ToolPanelPlacement;
    component: ComponentType<ToolPanelProps<TMap>>;
}

export interface ToolIcon<TMap> {
    icon: string;
    placement$: BehaviorSubject<ToolIconPlacement>;
    tooltip: TranslationId;
    onClick?: (map: TMap) => void;
    active$: BehaviorSubject<boolean>;
    rotate$: BehaviorSubject<number>;
    pitch$: BehaviorSubject<number>;
}

export interface ObservedToolIcon<TMap> {
    id: string;
    icon: string;
    tooltip: TranslationId;
    placement: ToolIconPlacement;
    active$: BehaviorSubject<boolean>;
    rotate$: BehaviorSubject<number>;
    pitch$: BehaviorSubject<number>;
    onClick?: (map: TMap) => void;
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

// TODO: Remove?
export interface ControlComponentProps {
    
}