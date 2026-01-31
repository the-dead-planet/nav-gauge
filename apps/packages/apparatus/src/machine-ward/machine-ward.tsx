import { ReactElement } from "react";
import { pairwise } from "rxjs";
import { MachineWardApp } from "./MachineWardApp";
import { Individuator } from "./individuator";
import { Engine, StateWarden } from "../state-warden";
import { Gear, GearId } from "../gears";
import { StorageKeeper } from "./storage-keeper";
import { MachineWardComponents } from "./model";

/**
 * Ward with machines. 
 * 
 * Describes the expected content of the applications and renders complete app.
 */
export abstract class MachineWard {
    public title = 'nav gauge';

    public readonly individuator: Individuator;
    public readonly storageKeeper: StorageKeeper;
    public readonly stateWarden: StateWarden;
    public readonly engine = new Engine();

    public constructor(
        gears: { [K in GearId]: (new (individuator: Individuator) => Gear<K>) | null },
        storage: StorageLike,
        prefersLightColorScheme: boolean
    ) {
        this.storageKeeper = new StorageKeeper(storage);
        this.individuator = new Individuator(this.storageKeeper, prefersLightColorScheme);
        this.stateWarden = new StateWarden(this.storageKeeper);

        this.engine.addGears(
            Object.values(gears).reduce<Gear<GearId>[]>((acc, Gear) => {
                if (Gear) {
                    acc.push(new Gear(this.individuator));
                }
                return acc;
            }, [])
        );

        this.initializeValves();
    }

    private initializeValves = () => {
        this.engine.openValves(this.engine.gears$.value, this.stateWarden);
        this.engine.gears$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                this.engine.closeValves(prev, this.stateWarden);
                this.engine.openValves(next, this.stateWarden);
            });
    };

    public abstract components: MachineWardComponents;

    public render = (): ReactElement => {
        return (
            <MachineWardApp
                title={this.title}
                individuator={this.individuator}
                storageKeeper={this.storageKeeper}
                stateWarden={this.stateWarden}
                components={this.components}
            />
        );
    }
}
