import { ReactElement } from "react";
import { combineLatest, pairwise, Subscription } from "rxjs";
import { MachineWardApp } from "./MachineWardApp";
import { Individuator } from "./individuator";
import { ChronoLens } from "./chrono-lens";
import { Animatrix, AttributionVault, Cartomancer, SignaliumBureau, ToolsStation, Translatron } from "..";
import { Engine } from "./engine";
import { Gear } from "./gears";
import { StorageKeeper } from "./storage-keeper";
import { MachineGear, MachineTranslationKey, MachineWardComponents } from "./model";
import { TranslationTable } from "./translatron";
import { MediaSubscriptionDefinition } from "@ui";
import * as Translations from "./translations";

/**
 * Ward with machines. 
 * 
 * Describes the expected content of the applications and renders complete app.
 */
export abstract class MachineWard<TMap = unknown, TNavigationPath extends string = string> {
    public title = 'nav gauge';

    public readonly namespace = 'machine-ward';
    public readonly translations: TranslationTable<MachineTranslationKey> = Translations;
    public readonly translationKey = MachineTranslationKey;

    public readonly individuator: Individuator;
    public readonly storageKeeper: StorageKeeper;
    public readonly engine = new Engine<TMap>();
    public readonly attributionVault = new AttributionVault();
    public readonly signaliumBureau = new SignaliumBureau();
    public readonly translatron = new Translatron();
    public readonly animatrix: Animatrix;
    public readonly cartomancer: Cartomancer<TMap>;
    public readonly chronoLens: ChronoLens;
    public readonly toolsStation: ToolsStation<TMap>;

    private toolsStationPresetSubscription: Subscription | null = null;
    private toolsStationPresetActiveSubscription: Subscription | null = null;
    private attributionVaultSubscription: Subscription | null = null;

    public constructor(
        gears: MachineGear<TMap>[],
        chronoLens: new (individuator: Individuator) => ChronoLens,
        storage: StorageLike,
        prefersLightColorScheme: boolean,
        protected media: MediaSubscriptionDefinition
    ) {
        this.translatron.register(this.namespace, this.translations);
        
        this.storageKeeper = new StorageKeeper(storage);
        this.individuator = new Individuator(prefersLightColorScheme);        
        this.animatrix = new Animatrix();        
        this.cartomancer = new Cartomancer();
        this.chronoLens = new chronoLens(this.individuator);

        const initialPreset = ToolsStation.detectPreset(
            this.cartomancer.mapLayout$.value,
            this.cartomancer.gaugeControls$.value,
            this.animatrix.controls$.value
        );
        this.toolsStation = new ToolsStation(initialPreset ?? 'default');

        this.engine.addGears(
            gears.reduce<Gear<TMap>[]>((acc, Gear) => {
                if (Gear) {
                    acc.push(new Gear({
                        individuator: this.individuator,
                        signaliumBureau: this.signaliumBureau,
                        attributionVault: this.attributionVault,
                        chronoLens: this.chronoLens,
                        cartomancer: this.cartomancer,
                        animatrix: this.animatrix,
                        toolsStation: this.toolsStation,
                        translatron: this.translatron,
                    }));
                }
                return acc;
            }, [])
        );
    }

    private gearsSubscription: Subscription | null = null

    private initializeValves = () => {
        this.engine.openValves(this.engine.gears$.value);
        this.gearsSubscription = this.engine.gears$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                this.engine.closeValves(prev);
                this.engine.openValves(next);
            });
    };

    private mount = () => {
        this.storageKeeper.initialize();
        this.individuator.initialize(this.storageKeeper, this.translatron);
        this.attributionVaultSubscription = this.subscribeAttributionVault();
        this.toolsStationPresetSubscription = this.subscribeToolsStationPreset();
        this.toolsStationPresetActiveSubscription = this.subscribeToolsStationPresetActive();
        this.animatrix.initialize(this.storageKeeper);
        this.cartomancer.initialize(this.storageKeeper, this.translatron, this.toolsStation);
        this.initializeValves();
    };

    public unmount = () => {
        this.gearsSubscription?.unsubscribe();
        this.cartomancer.cleanUp();
        this.animatrix.cleanUp();
        this.toolsStationPresetActiveSubscription?.unsubscribe();
        this.toolsStationPresetSubscription?.unsubscribe();
        this.attributionVaultSubscription?.unsubscribe();
        this.individuator.cleanUp();
        this.storageKeeper.cleanUp();
    };

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
            const { mapLayout: { size, ...mapLayout }, gaugeControls: { ...gaugeControls }, animationControls } = option;
            this.cartomancer.mapLayout$.next({ size: { ...size }, ...mapLayout });
            this.cartomancer.gaugeControls$.next({ ...gaugeControls });
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

    /**
     * Routing and navigation between aplication views
     */
    public abstract navigate: (path: TNavigationPath) => void;

    /**
     * Routing and navigation back
     */
    public abstract navigateBack: () => void;

    public abstract components: MachineWardComponents<TNavigationPath>;

    public render = (): ReactElement => {
        return (
            <MachineWardApp
                namespace={this.namespace}
                title={this.title}
                media={this.media}
                individuator={this.individuator}
                storageKeeper={this.storageKeeper}
                signaliumBureau={this.signaliumBureau}
                attributionVault={this.attributionVault}
                animatrix={this.animatrix}
                cartomancer={this.cartomancer}
                chronoLens={this.chronoLens}
                toolsStation={this.toolsStation}
                translatron={this.translatron}
                engine={this.engine}
                components={this.components}
                onMount={this.mount}
                onUnmount={this.unmount}
                onNavigate={this.navigate}
                onNavigateBack={this.navigateBack}
            />
        );
    }
}
