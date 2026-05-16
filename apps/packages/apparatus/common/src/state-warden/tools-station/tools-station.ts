import { ComponentType } from "react";
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap } from "rxjs";
import { AnimationControlsType, Animatrix } from "../animatrix";
import { Cartomancer, ControlPlacement, GaugeControlsType, MapLayout } from "../cartomancer";
import { Tool, Preset, PresetOption, ToolPlacement, ToolProps, ControlComponentProps, ObservedTool } from "./model";

export class ToolsStation<TMap> {
    public static placements: ToolPlacement[] = ["top", "right", "bottom", "left"];

    /**
     * Tools to display around the map.
     * Tools have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool with a given `id` already exists, it will be overwritten.
     */
    public toolComponents$ = new BehaviorSubject<Map<string, Tool<TMap>>>(new Map());

    /**
     * Subscribe to changes of tools and their placement.
     */
    public toolComponentsByPlacement$: Observable<ObservedTool<TMap>[]> = this.toolComponents$.pipe(switchMap((toolsMap) => {
        const tools = [...toolsMap.entries()];

        if (tools.length === 0) {
            return of([]);
        }

        return combineLatest(tools.map(([id, tool]) => tool.placement$.pipe(
            map((placement) => ({ placement, id, component: tool.component }))
        )));
    }));

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

    public getToolsByPlacement = (toolComponents: ObservedTool<TMap>[]) => {
        return toolComponents.reduce<{ [key in ToolPlacement]: ObservedTool<TMap>[] }>((acc, val) => {
            acc[val.placement].push(val);
            return acc;
        }, { top: [], right: [], bottom: [], left: [] });
    };

    /**
     * Adds a new map tool to display around the map.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     * If a tool with a given `id` already exists, it will be overwritten.
     */
    public addToolComponent = (id: string, placement: ToolPlacement, component: ComponentType<ToolProps<TMap>>) => {
        const nextTools = new Map(this.toolComponents$.value);
        nextTools.set(id, {
            placement$: new BehaviorSubject(placement),
            component,
        });
        this.toolComponents$.next(nextTools);
    };

    /**
     * Removes the tool with a given `id`.
     */
    public removeToolComponent = (id: string) => {
        const nextTools = new Map(this.toolComponents$.value);
        nextTools.delete(id);
        this.toolComponents$.next(nextTools);
    };

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
        { controlPlacement, ...gaugeControls }: GaugeControlsType,
        animationControls: AnimationControlsType
    ): Preset | undefined => {
        return ToolsStation.presetOptions.find((option) => (
            Object.entries(size).every(([key, value]) => option.mapLayout.size[key as keyof MapLayout['size']] === value) &&
            Object.entries(mapLayout).every(([key, value]) => option.mapLayout[key as keyof MapLayout] === value) &&
            Object.entries(controlPlacement).every(([key, value]) => option.gaugeControls.controlPlacement[key as keyof ControlPlacement] === value) &&
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
        const { controlPlacement, ...controls } = gaugeControls;

        return {
            ...controls,
            controlPlacement: { ...controlPlacement }
        };
    };

    /**
     * Returns a new deep copy of animation controls
     */
    public copyAnimationControls = (animationControls: AnimationControlsType): AnimationControlsType => {
        return { ...animationControls };
    };
}
