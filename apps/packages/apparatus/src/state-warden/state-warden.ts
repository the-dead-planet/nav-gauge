import { BehaviorSubject, combineLatest, pairwise } from "rxjs";
import { Theme } from "@ui";
import { Animatrix } from "./animatrix";
import { AttributionVault } from "./attribution-vault"
import { Cartomancer } from "./cartomancer";
import { ChronoLens } from "./chrono-lens";
import { Engine } from "./engine";
import { SignaliumBureau } from "./signalium-bureau";
import { ApplicationSettingsType, getDefaultApplicationSettings } from "@tinker-chest";
import { StorageKeeper } from "../storage-keeper/storage-keeper";
import { ToolsStation } from "./tools-station";

/**
 * Warden does what warden needs to do.
 * Guards the state and provides access to control mechanisms.
 */
export class StateWarden {
    private applicationSettingsStorageId = 'application-settings';
    public applicationSettings$: BehaviorSubject<ApplicationSettingsType>;
    public animatrix: Animatrix;
    public cartomancer: Cartomancer;
    public toolsStation: ToolsStation;
    public storageKeeper: StorageKeeper;

    public constructor(storage: StorageLike, prefersLightColorScheme: boolean) {
        this.storageKeeper = new StorageKeeper(storage);

        const initialSettings = getDefaultApplicationSettings(prefersLightColorScheme ? Theme.Light : Theme.Dark);
        this.applicationSettings$ = new BehaviorSubject<ApplicationSettingsType>(initialSettings);
        this.storageKeeper.synchronizeSubjectWithStorage(this.applicationSettings$, this.applicationSettingsStorageId);

        this.animatrix = new Animatrix(this.storageKeeper);
        this.cartomancer = new Cartomancer(this.storageKeeper);
        this.setUpAttributionUpdates();

        const initialPreset = ToolsStation.detectPreset(
            this.cartomancer.mapLayout$.value,
            this.cartomancer.gaugeControls$.value,
            this.animatrix.controls$.value
        );
        this.toolsStation = new ToolsStation(initialPreset ?? 'default');
        this.setUpPresetUpdate();
    }

    private setUpAttributionUpdates = () => {
        const addEntry = (styleId: keyof typeof Cartomancer.styles) => {
            const style = Cartomancer.styles[styleId];
            if (!style?.attribution) {
                return;
            }
            this.attributionVault.addEntry(styleId, style.attribution);
        };

        addEntry(this.cartomancer.selectedStyle$.value.id);
        this.cartomancer.selectedStyle$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                this.attributionVault.removeEntry(prev.id);
                addEntry(next.id);
            });
    };

    private setUpPresetUpdate = () => {
        this.toolsStation.preset$.subscribe((next) => {
            const option = ToolsStation.presetOptions.find((option) => option.value === next);
            if (!option) {
                return;
            }
            const { mapLayout: { size, ...mapLayout }, gaugeControls: { controlPlacement, ...gaugeControls }, animationControls } = option;
            this.cartomancer.mapLayout$.next({ size: { ...size }, ...mapLayout });
            this.cartomancer.gaugeControls$.next({ controlPlacement: { ...controlPlacement }, ...gaugeControls });
            this.animatrix.controls$.next({ ...animationControls });
        });

        combineLatest([
            this.cartomancer.mapLayout$,
            this.cartomancer.gaugeControls$,
            this.animatrix.controls$
        ]).subscribe((args) => {
            this.toolsStation.isPresetActive$.next(ToolsStation.detectPreset(...args) === this.toolsStation.preset$.value);
        })
    };

    public chronoLens = new ChronoLens();
    public attributionVault = new AttributionVault();
    public engine = new Engine();
    public signaliumBureau = new SignaliumBureau();
}
