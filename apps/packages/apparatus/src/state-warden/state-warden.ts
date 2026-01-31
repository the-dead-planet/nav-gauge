import { combineLatest, pairwise, Subscription } from "rxjs";
import { Animatrix } from "./animatrix";
import { AttributionVault } from "./attribution-vault"
import { Cartomancer } from "./cartomancer";
import { ChronoLens } from "./chrono-lens";
import { SignaliumBureau } from "./signalium-bureau";
import { ToolsStation } from "./tools-station";
import { StorageKeeper } from "../machine-ward";

/**
 * Warden does what warden needs to do.
 * Guards the state and provides access to control mechanisms.
 */
export class StateWarden {
    public animatrix: Animatrix;
    public cartomancer: Cartomancer;
    public toolsStation: ToolsStation;
    private toolsStationPresetSubscription: Subscription | null = null;
    private toolsStationPresetActiveSubscription: Subscription | null = null;

    public constructor() {
        this.animatrix = new Animatrix();
        this.cartomancer = new Cartomancer();

        const initialPreset = ToolsStation.detectPreset(
            this.cartomancer.mapLayout$.value,
            this.cartomancer.gaugeControls$.value,
            this.animatrix.controls$.value
        );
        this.toolsStation = new ToolsStation(initialPreset ?? 'default');
    }

    public initialize = (storageKeeper: StorageKeeper) => {
        this.attributionVaultSubscription = this.subscribeAttributionVault();
        this.toolsStationPresetSubscription = this.subscribeToolsStationPreset();
        this.toolsStationPresetActiveSubscription = this.subscribeToolsStationPresetActive();
        this.animatrix.initialize(storageKeeper);
        this.cartomancer.initialize(storageKeeper);
    }

    public cleanUp = () => {
        this.cartomancer.cleanUp();
        this.animatrix.cleanUp();
        this.toolsStationPresetActiveSubscription?.unsubscribe();
        this.toolsStationPresetSubscription?.unsubscribe();
        this.attributionVaultSubscription?.unsubscribe();
    };

    private attributionVaultSubscription: Subscription | null = null;

    private subscribeAttributionVault = (): Subscription => {
        const addEntry = (styleId: keyof typeof Cartomancer.styles) => {
            const style = Cartomancer.styles[styleId];
            if (!style?.attribution) {
                return;
            }
            this.attributionVault.addEntry(styleId, style.attribution);
        };

        addEntry(this.cartomancer.selectedStyle$.value.id);

        return this.cartomancer.selectedStyle$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                this.attributionVault.removeEntry(prev.id);
                addEntry(next.id);
            });
    };

    private subscribeToolsStationPreset = (): Subscription => {
        return this.toolsStation.preset$.subscribe((next) => {
            const option = ToolsStation.presetOptions.find((option) => option.value === next);
            if (!option) {
                return;
            }
            const { mapLayout: { size, ...mapLayout }, gaugeControls: { controlPlacement, ...gaugeControls }, animationControls } = option;
            this.cartomancer.mapLayout$.next({ size: { ...size }, ...mapLayout });
            this.cartomancer.gaugeControls$.next({ controlPlacement: { ...controlPlacement }, ...gaugeControls });
            this.animatrix.controls$.next({ ...animationControls });
        });
    };

    private subscribeToolsStationPresetActive = (): Subscription => {
        return combineLatest([
            this.cartomancer.mapLayout$,
            this.cartomancer.gaugeControls$,
            this.animatrix.controls$
        ]).subscribe((args) => {
            this.toolsStation.isPresetActive$.next(ToolsStation.detectPreset(...args) === this.toolsStation.preset$.value);
        })
    };

    public chronoLens = new ChronoLens();
    public attributionVault = new AttributionVault();
    public signaliumBureau = new SignaliumBureau();
}
