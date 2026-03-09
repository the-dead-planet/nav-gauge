import { ReactElement } from "react";
import { pairwise, Subscription } from "rxjs";
import { MachineWardApp } from "./MachineWardApp";
import { Individuator, OrientationSubscriptionDefinition } from "./individuator";
import { ChronoLens } from "./chrono-lens";
import { StateWarden } from "../state-warden";
import { Engine } from "./engine";
import { Gear, GearId } from "../gears";
import { StorageKeeper } from "./storage-keeper";
import { MachineWardComponents } from "./model";

/**
 * Ward with machines. 
 * 
 * Describes the expected content of the applications and renders complete app.
 */
export abstract class MachineWard<TMap = unknown> {
    public title = 'nav gauge';

    public readonly individuator: Individuator;
    public readonly storageKeeper: StorageKeeper;
    public readonly chronoLens: ChronoLens;
    public readonly stateWarden: StateWarden<TMap>;
    public readonly engine = new Engine<TMap>();

    public constructor(
        gears: { [K in GearId]: (new (stateWarden: StateWarden<TMap>, individuator: Individuator, chronoLens: ChronoLens) => Gear<TMap, K>) | null },
        chronoLens: new (individuator: Individuator) => ChronoLens,
        storage: StorageLike,
        prefersLightColorScheme: boolean,
        orientationSubscription: OrientationSubscriptionDefinition
    ) {
        this.storageKeeper = new StorageKeeper(storage);
        this.individuator = new Individuator(prefersLightColorScheme, orientationSubscription);
        this.chronoLens = new chronoLens(this.individuator);
        this.stateWarden = new StateWarden<TMap>();

        this.engine.addGears(
            Object.values(gears).reduce<Gear<TMap, GearId>[]>((acc, Gear) => {
                if (Gear) {
                    acc.push(new Gear(this.stateWarden, this.individuator, this.chronoLens));
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

    public abstract components: MachineWardComponents;

    public render = (): ReactElement => {
        return (
            <MachineWardApp
                title={this.title}
                individuator={this.individuator}
                storageKeeper={this.storageKeeper}
                stateWarden={this.stateWarden}
                chronoLens={this.chronoLens}
                components={this.components}
                onMount={this.initializeValves}
                onUnmount={this.cleanUp}
            />
        );
    }
}
