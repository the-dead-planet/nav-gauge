import { ComponentType } from "react";
import { BehaviorSubject } from "rxjs";
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
    icon?: string;
    value$: BehaviorSubject<string | null>;
    placement$: BehaviorSubject<ToolIconPlacement>;
    tooltip: TranslationId | ((value: string | null) => TranslationId);
    onClick?: (map: TMap) => void;
    active$: BehaviorSubject<boolean>;
    rotate$: BehaviorSubject<number>;
    pitch$: BehaviorSubject<number>;
}

export interface ObservedToolIcon<TMap> {
    id: string;
    icon?: string;
    tooltip: TranslationId | ((value: string | null) => TranslationId);
    placement: ToolIconPlacement;
    value$: BehaviorSubject<string | null>;
    active$: BehaviorSubject<boolean>;
    rotate$: BehaviorSubject<number>;
    pitch$: BehaviorSubject<number>;
    onClick?: (map: TMap) => void;
}

export interface TopToolsProps<TMap> {
    map: TMap;
}
