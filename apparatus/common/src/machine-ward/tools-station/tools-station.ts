import { ComponentType } from "react";
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap } from "rxjs";
import { AnimationControlsType, Animatrix } from "../animatrix";
import { Cartomancer, GaugeControlsType, MapLayout } from "../cartomancer";
import {
    ToolPanel,
    Preset,
    PresetOption,
    ToolPanelPlacement,
    ToolPanelProps,
    ControlComponentProps,
    ObservedToolPanel,
    ToolIcon,
    ObservedToolIcon,
    ToolIconPlacement,
} from "./model";
import { TranslationId } from "../translatron";

export class ToolsStation<TMap> {
    public static placements: ToolPanelPlacement[] = ["right", "bottom", "left"];

    /**
     * Tools to display in panels.
     * Tools have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool with a given `id` already exists, it will be overwritten.
     */
    public toolPanels$ = new BehaviorSubject<Map<string, ToolPanel<TMap>>>(new Map());

    /**
     * Subscribe to changes of tools and their placement.
     */
    public toolPanelsByPlacement$: Observable<ObservedToolPanel<TMap>[]> = this.toolPanels$.pipe(switchMap((toolsMap) => {
        const toolPanels = [...toolsMap.entries()];

        if (toolPanels.length === 0) {
            return of([]);
        }

        return combineLatest(toolPanels.map(([id, toolPanel]) => toolPanel.placement$.pipe(
            map((placement): ObservedToolPanel<TMap> => ({
                placement,
                id,
                icon: toolPanel.icon,
                title: toolPanel.title,
                component: toolPanel.component,
            }))
        )));
    }));

    /**
     * Tools to display in icons around the map.
     * Tools have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool with a given `id` already exists, it will be overwritten.
     */
    public toolIcons$ = new BehaviorSubject<Map<string, ToolIcon<TMap>>>(new Map());

    /**
     * Subscribe to changes of tool icon placements.
     */
    public toolIconsByPlacement$: Observable<ObservedToolIcon<TMap>[]> = this.toolIcons$.pipe(
        switchMap((toolsMap) => {
            const toolIcons = [...toolsMap.entries()];

            if (toolIcons.length === 0) {
                return of([]);
            }

            return combineLatest(
                toolIcons.map(([id, { placement$, ...toolIcon }]) =>
                    combineLatest([placement$]).pipe(
                        map(([placement]): ObservedToolIcon<TMap> => ({ id, placement, ...toolIcon }))
                    )
                )
            );
        })
    );

    /**
     * Do not have access to map context.
     */
    public controlComponents$ = new BehaviorSubject<Map<string, ComponentType>>(new Map());

    /**
     * Update of a preset will trigger control state update to predefined values which user can later further configure.
     */
    public preset$: BehaviorSubject<Preset>;

    /**
     * Whether current control state matches the value of `preset$`.
     */
    public isPresetActive$ = new BehaviorSubject<boolean>(true);

    public constructor(preset: Preset) {
        this.preset$ = new BehaviorSubject<Preset>(preset);
    }

    public getToolPanelsByPlacement = (toolComponents: ObservedToolPanel<TMap>[]) => {
        return toolComponents.reduce<{ [key in ToolPanelPlacement]: ObservedToolPanel<TMap>[] }>((acc, val) => {
            acc[val.placement].push(val);
            return acc;
        }, { right: [], bottom: [], left: [] });
    };

    public getToolIconsByPlacement = (toolIcons: ObservedToolIcon<TMap>[]) => {
        return toolIcons.reduce<{ [key in ToolIconPlacement]: ObservedToolIcon<TMap>[] }>((acc, val) => {
            acc[val.placement].push(val);
            return acc;
        }, { right: [], left: [] });
    };

    /**
     * Adds a new tool panel to display.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool panel with a given `id` already exists, it will be overwritten.
     */
    public addToolPanel = (
        id: string,
        { title, icon, placement, component }: {
            title: TranslationId, icon: string,
            placement: ToolPanelPlacement,
            component: ComponentType<ToolPanelProps<TMap>>,
        }
    ) => {
        const nextToolPanels = new Map(this.toolPanels$.value);
        nextToolPanels.set(id, {
            title,
            icon,
            placement$: new BehaviorSubject(placement),
            component,
        });
        this.toolPanels$.next(nextToolPanels);
    };

    /**
     * Removes the tool panel with a given `id`.
     */
    public removeToolPanel = (id: string) => {
        const nextToolPanels = new Map(this.toolPanels$.value);
        nextToolPanels.delete(id);
        this.toolPanels$.next(nextToolPanels);
    };

    /**
     * Adds a new tool icon to display.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool icon with a given `id` already exists, it will be overwritten.
     */
    public addToolIcon = (
        id: string,
        { tooltip, value = null, icon, placement, onClick, active = false, rotate = 0, pitch = 0 }: {
            icon?: string,
            value?: string | null,
            tooltip: TranslationId | ((value: string | null) => TranslationId),
            placement: ToolIconPlacement;
            active?: boolean;
            rotate?: number;
            pitch?: number;
            onClick?: (map: TMap) => void;
        },
    ): ToolIcon<TMap> => {
        const nextToolIcons = new Map(this.toolIcons$.value);
        const toolIcon: ToolIcon<TMap> = {
            tooltip,
            icon,
            value$: new BehaviorSubject(value),
            placement$: new BehaviorSubject(placement),
            active$: new BehaviorSubject(active),
            rotate$: new BehaviorSubject(rotate),
            pitch$: new BehaviorSubject(pitch),
            onClick
        };
        nextToolIcons.set(id, toolIcon);
        this.toolIcons$.next(nextToolIcons);

        return toolIcon;
    };

    /**
     * Removes the tool icon with a given `id`.
     */
    public removeToolIcon = (id: string) => {
        const nextToolIcons = new Map(this.toolIcons$.value);
        nextToolIcons.delete(id);
        this.toolIcons$.next(nextToolIcons);
    };

    // TODO: Remove this observable, this content will go to bottom panel
    /**
     * Adds a new map tool to display around the map.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool with a given `id` already exists, it will be overwritten.
     */
    public addControlComponent = (id: string, component: ComponentType<ControlComponentProps>) => {
        const nextControls = new Map(this.controlComponents$.value);
        nextControls.set(id, component);
        this.controlComponents$.next(nextControls);
    };

    /**
     * Removes the tool with a given `id`.
     */
    public removeControlComponent = (id: string) => {
        const nextControls = new Map(this.controlComponents$.value);
        nextControls.delete(id);
        this.controlComponents$.next(nextControls);
    };

    public static presetOptions: PresetOption[] = [
        {
            value: 'default',
            label: 'Default',
            mapLayout: Cartomancer.defaultMapLayout,
            gaugeControls: Cartomancer.defaultGaugeControls,
            animationControls: Animatrix.defaultControls,
        },
        {
            value: 'racing-game',
            label: 'Racing game',
            mapLayout: {
                size: {
                    type: 'manual',
                    width: 400,
                    height: 400
                },
                borderWidth: 5,
                borderColor: '#ff0000',
                borderRadius: '50%',
                innerBorderWidth: 0,
                innerBorderColor: '#000000',
                boxShadow: '0px 0px 16px #ff0000, 0px 0px 16px #ff0000',
                innerBoxShadow: '',
            },
            gaugeControls: Cartomancer.defaultGaugeControls,
            animationControls: Animatrix.defaultControls,
        },
    ];

    public static detectPreset = (
        { size, ...mapLayout }: MapLayout,
        { ...gaugeControls }: GaugeControlsType,
        animationControls: AnimationControlsType
    ): Preset | undefined => {
        return ToolsStation.presetOptions.find((option) => (
            Object.entries(size).every(([key, value]) => option.mapLayout.size[key as keyof MapLayout['size']] === value) &&
            Object.entries(mapLayout).every(([key, value]) => option.mapLayout[key as keyof MapLayout] === value) &&
            Object.entries(gaugeControls).every(([key, value]) => option.gaugeControls[key as keyof GaugeControlsType] === value) &&
            Object.entries(animationControls).every(([key, value]) => option.animationControls[key as keyof AnimationControlsType] === value)
        ))?.value;
    };

    /**
     * @returns A copy of preset values, if found for a given `preset`.
     */
    public getPresetValues = (preset: Preset): {
        mapLayout: MapLayout;
        gaugeControls: GaugeControlsType;
        animationControls: AnimationControlsType;
    } | undefined => {
        const option = ToolsStation.presetOptions.find((option) => option.value === preset);

        if (option) {
            return {
                mapLayout: this.copyMapLayout(option.mapLayout),
                gaugeControls: this.copyGaugeControls(option.gaugeControls),
                animationControls: this.copyAnimationControls(option.animationControls)
            };
        }
    };

    /**
     * Returns a new deep copy of gauge controls
     */
    public copyMapLayout = (mapLayout: MapLayout): MapLayout => {
        const { size, ...layout } = mapLayout;

        return {
            ...layout,
            size: { ...size }
        };
    };

    /**
     * Returns a new deep copy of gauge controls
     */
    public copyGaugeControls = (gaugeControls: GaugeControlsType): GaugeControlsType => {
        return { ...gaugeControls };
    };

    /**
     * Returns a new deep copy of animation controls
     */
    public copyAnimationControls = (animationControls: AnimationControlsType): AnimationControlsType => {
        return { ...animationControls };
    };
}
