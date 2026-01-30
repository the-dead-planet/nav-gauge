import { ComponentType, ReactElement } from "react";
import { pairwise } from "rxjs";
import { ErrorBoundaryProps } from "@ui";
import { MachineWardApp } from "./MachineWardApp";
import { StateWarden } from "../state-warden";
import { Gear, GearId } from "../gears";
import { MachineWardFooterProps, MachineWardLayoutProps, MachineWardMachineProps, MachineWardNoticesProps, MachineWardTopBarProps } from "./model";

/**
 * Ward with machines. 
 * 
 * Describes the expected content of the applications and renders complete app.
 */
export abstract class MachineWard {
    public readonly storage: StorageLike;
    public readonly prefersLightColorScheme: boolean;
    public readonly stateWarden: StateWarden;

    public constructor(
        gears: { [key in GearId]: (new (stateWarden: StateWarden) => Gear<GearId>) | null },
        storage: StorageLike,
        prefersLightColorScheme: boolean
    ) {
        this.storage = storage;
        this.prefersLightColorScheme = prefersLightColorScheme;
        this.stateWarden = new StateWarden(storage, prefersLightColorScheme);

        this.stateWarden.engine.addGears(
            Object.values(gears).reduce<Gear<GearId>[]>((acc, Gear) => {
                if (Gear) {
                    acc.push(new Gear(this.stateWarden));
                }
                return acc;
            }, [])
        );

        this.initializeValves();
    }

    private initializeValves = () => {
        this.stateWarden.engine.openValves(this.stateWarden.engine.gears$.value, this.stateWarden);
        this.stateWarden.engine.gears$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                this.stateWarden.engine.closeValves(prev, this.stateWarden);
                this.stateWarden.engine.openValves(next, this.stateWarden);
            });
    };

    public abstract readonly errorFallbackComponent: ErrorBoundaryProps['fallbackComponent'];
    public abstract readonly layoutComponent: ComponentType<MachineWardLayoutProps>;
    public abstract readonly topBarComponent: ComponentType<MachineWardTopBarProps>;
    public abstract readonly machineComponent: ComponentType<MachineWardMachineProps>;
    public abstract readonly footerComponent: ComponentType<MachineWardFooterProps>;
    public abstract readonly noticesComponent: ComponentType<MachineWardNoticesProps>;

    public title = 'nav gauge';

    public render = (): ReactElement => {
        return <MachineWardApp machineWard={this} />;
    }
}
