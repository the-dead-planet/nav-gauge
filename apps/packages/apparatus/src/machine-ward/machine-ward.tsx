import { ComponentType, FC, ReactNode } from "react";
import { GearId, MachineWardFooterProps, MachineWardLayoutProps, MachineWardMachineProps, MachineWardNoticesProps, MachineWardTopBarProps } from "./model";
import { MachineWardApp } from "./MachineWardApp";
import { Gear, StateWarden } from "../state-warden";
import { ErrorBoundaryProps } from "@ui";
import { pairwise } from "rxjs";

/**
 * Ward with machines. 
 * 
 * Describes the expected content of the applications and renders complete app.
 */
export abstract class MachineWard {
    public readonly storage: StorageLike;
    public readonly prefersLightColorScheme: boolean;
    public readonly stateWarden: StateWarden;
    public gears: { [key in GearId]: Gear<GearId> | null };

    public constructor(
        gears: { [key in GearId]: Gear<GearId> | null },
        storage: StorageLike,
        prefersLightColorScheme: boolean
    ) {
        this.storage = storage;
        this.prefersLightColorScheme = prefersLightColorScheme;
        this.stateWarden = new StateWarden(storage, prefersLightColorScheme);
        this.gears = gears;
        this.initializeValves();
    }
    
    private initializeValves = () => {
        for (const gear of Object.values(this.gears)) {
            if (!gear) {
                continue;
            }
            this.stateWarden.engine.addGear(gear)
        }

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

    public render = (): ReactNode => {
        return <MachineWardApp machineWard={this} />;
    }
}
