import { ComponentType, ReactElement } from "react";
import { BehaviorSubject, pairwise } from "rxjs";
import { ErrorBoundaryProps, Theme } from "@ui";
import { ApplicationSettingsType } from "@tinker-chest";
import { MachineWardApp } from "./MachineWardApp";
import { Engine, StateWarden } from "../state-warden";
import { Gear, GearId } from "../gears";
import { StorageKeeper } from "../storage-keeper";
import { MachineWardFooterProps, MachineWardLayoutProps, MachineWardMachineProps, MachineWardNoticesProps, MachineWardTopBarProps } from "./model";

/**
 * Ward with machines. 
 * 
 * Describes the expected content of the applications and renders complete app.
 */
export abstract class MachineWard {
    /**
     * Provides default settings which can be later changed by user.
     * @param defaultTheme Defaults to dark theme.
     * @returns 
     */
    private static getDefaultApplicationSettings = (defaultTheme?: Theme): ApplicationSettingsType => ({
        theme: defaultTheme || Theme.Dark,
        /**
         * When set to true, user will be shown a confirmation popup on page close or reload.
         */
        confirmBeforeLeave: false,
    });

    private readonly applicationSettingsStorageId = 'application-settings';
    public readonly applicationSettings$: BehaviorSubject<ApplicationSettingsType>;
    public readonly storageKeeper: StorageKeeper;
    public readonly stateWarden: StateWarden;
    public engine = new Engine();

    public constructor(
        gears: { [K in GearId]: (new (applicationSettings$: BehaviorSubject<ApplicationSettingsType>) => Gear<K>) | null },
        storage: StorageLike,
        prefersLightColorScheme: boolean
    ) {
        this.storageKeeper = new StorageKeeper(storage);
        this.stateWarden = new StateWarden(this.storageKeeper);

        const initialSettings = MachineWard.getDefaultApplicationSettings(prefersLightColorScheme ? Theme.Light : Theme.Dark);
        this.applicationSettings$ = new BehaviorSubject<ApplicationSettingsType>(initialSettings);
        this.storageKeeper.synchronizeSubjectWithStorage(this.applicationSettings$, this.applicationSettingsStorageId);

        this.engine.addGears(
            Object.values(gears).reduce<Gear<GearId>[]>((acc, Gear) => {
                if (Gear) {
                    acc.push(new Gear(this.applicationSettings$));
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
