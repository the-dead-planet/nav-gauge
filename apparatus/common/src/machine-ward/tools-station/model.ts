import { ComponentType } from "react";
import { BehaviorSubject } from "rxjs";
import { TranslationId } from "../translatron";

export type ToolPanelPlacement = 'right' | 'left' | 'bottom';
export type ToolIconPlacement = 'right' | 'left';

export interface ToolPanelProps<TMap> {
    map: TMap;
    placement: ToolPanelPlacement;
}

export interface ToolPanel<TMap> {
    icon: string;
    placement$: BehaviorSubject<ToolPanelPlacement>;
    title: TranslationId;
    headerComponent?: ComponentType<ToolPanelProps<TMap>>;
    contentComponent: ComponentType<ToolPanelProps<TMap>>;
}

export interface ObservedToolPanel<TMap> {
    id: string;
    icon: string;
    title: TranslationId;
    placement: ToolPanelPlacement;
    headerComponent?: ComponentType<ToolPanelProps<TMap>>;
    contentComponent: ComponentType<ToolPanelProps<TMap>>;
}

export interface ToolIcon<TMap> {
    icon?: string;
    value$: BehaviorSubject<string | null>;
    placement$: BehaviorSubject<ToolIconPlacement>;
    disabled$: BehaviorSubject<boolean>;
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
    disabled$: BehaviorSubject<boolean>;
    active$: BehaviorSubject<boolean>;
    rotate$: BehaviorSubject<number>;
    pitch$: BehaviorSubject<number>;
    onClick?: (map: TMap) => void;
}

export interface TopToolsProps<TMap> {
    map: TMap;
}

export interface ToolbarSizeRef {
    current: {
        clientHeight: number;
        clientWidth: number;
    } | null;
}