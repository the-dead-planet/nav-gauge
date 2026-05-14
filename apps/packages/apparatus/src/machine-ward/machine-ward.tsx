import { ReactElement } from "react";
import { pairwise, Subscription } from "rxjs";
import { MachineWardApp } from "./MachineWardApp";
import { Individuator, OrientationSubscriptionDefinition } from "./individuator";
import { ChronoLens } from "../state-warden/chrono-lens";
import { StateWarden } from "../state-warden";
import { Engine } from "./engine";
import { Gear } from "../gears";
import { StorageKeeper } from "./storage-keeper";
import { MachineGear, MachineWardComponents } from "./model";

/**
 * Ward with machines. 
 * 
 * Describes the expected content of the applications and renders complete app.
 */
export abstract class MachineWard<TMap = unknown, TNavigationPath extends string = string> {
    public title = 'nav gauge';

    public readonly individuator: Individuator;
    public readonly storageKeeper: StorageKeeper;
    public readonly stateWarden: StateWarden<TMap>;
    public readonly engine = new Engine<TMap>();

    public constructor(
        gears: MachineGear<TMap>[],
        chronoLens: new (individuator: Individuator) => ChronoLens,
        storage: StorageLike,
        prefersLightColorScheme: boolean,
        orientationSubscription: OrientationSubscriptionDefinition
    ) {
        this.storageKeeper = new StorageKeeper(storage);
        this.individuator = new Individuator(prefersLightColorScheme, orientationSubscription);
        this.stateWarden = new StateWarden<TMap>(new chronoLens(this.individuator));

        this.engine.addGears(
            gears.reduce<Gear<TMap>[]>((acc, Gear) => {
                if (Gear) {
                    acc.push(new Gear(this.stateWarden, this.individuator));
                }
                return acc;
            }, [])
        );
    }

    private gearsSubscription: Subscription | null = null

    private initializeValves = () => {
        this.engine.openValves(this.engine.gears$.value, this.stateWarden, this.individuator);
        this.gearsSubscription = this.engine.gears$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                this.engine.closeValves(prev, this.stateWarden, this.individuator);
                this.engine.openValves(next, this.stateWarden, this.individuator);
            });
    };

    private cleanUp = () => {
        this.gearsSubscription?.unsubscribe();
    }

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
                title={this.title}
                individuator={this.individuator}
                storageKeeper={this.storageKeeper}
                stateWarden={this.stateWarden}
                components={this.components}
                navigate={this.navigate}
                onMount={this.initializeValves}
                onUnmount={this.cleanUp}
            />
        );
    }
}
