import { BehaviorSubject } from "rxjs";
import { AnimationControlsType, Animatrix } from "../animatrix";
import { ControlPlacement, defaultGaugeControls, defaultMapLayout, GaugeControlsType, MapLayout } from "../cartomancer";
import { Preset, PresetOption } from "./model";

export class PresetStation {
    public preset$: BehaviorSubject<Preset>;
    public active$ = new BehaviorSubject<boolean>(true);

    public constructor(preset: Preset) {
        this.preset$ = new BehaviorSubject<Preset>(preset);
    }

    private static racingGameMapLayout: MapLayout = {
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
    };

    public static presetOptions: PresetOption[] = [
        {
            value: 'default',
            label: 'Default',
            mapLayout: defaultMapLayout,
            gaugeControls: defaultGaugeControls,
            animationControls: Animatrix.defaultControls,
        },
        {
            value: 'racing-game',
            label: 'Racing game',
            mapLayout: PresetStation.racingGameMapLayout,
            gaugeControls: defaultGaugeControls,
            animationControls: Animatrix.defaultControls,
        },
    ];

    public static detectPreset = (
        { size, ...mapLayout }: MapLayout,
        { controlPlacement, ...gaugeControls }: GaugeControlsType,
        animationControls: AnimationControlsType
    ): Preset | undefined => {
        return PresetStation.presetOptions.find((option) => (
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
        const option = PresetStation.presetOptions.find((option) => option.value === preset);
        
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
